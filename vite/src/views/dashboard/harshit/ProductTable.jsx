import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSort, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { CSVLink } from 'react-csv'; 

// Data from CSV file
const initialProducts = [
  {
    index: 1,
    product: "Garlic Oil - Vegetarian Capsule 500 mg",
    category: "Beauty & Hygiene",
    sub_category: "Hair Care",
    brand: "Sri Sri Ayurveda",
    sale_price: 220.0,
    market_price: 220.0,
    type: "Hair Oil & Serum",
    rating: 4.1,
    description: "This Product contains Garlic Oil that is known...",
    quantity: 27,
  },
  {
    index: 2,
    product: "Water Bottle - Orange",
    category: "Kitchen, Garden & Pets",
    sub_category: "Storage & Accessories",
    brand: "Mastercook",
    sale_price: 180.0,
    market_price: 180.0,
    type: "Water & Fridge Bottles",
    rating: 2.3,
    description: "Each product is microwave safe (without lid)...",
    quantity: 15,
  },
];

const ProductTable = () => {
  const [products, setProducts] = useState(initialProducts);
  const [newProduct, setNewProduct] = useState({
    index: products.length + 1,
    product: '',
    category: '',
    sub_category: '',
    brand: '',
    sale_price: '',
    market_price: '',
    type: '',
    rating: '',
    description: '',
    quantity: '',
  });
  const [sortConfig, setSortConfig] = useState({ key: '', direction: '' });

  // Handle sorting
  const handleSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  // Sorting logic
  const sortedProducts = [...products].sort((a, b) => {
    if (sortConfig.key) {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortConfig.direction === 'ascending'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }
      return sortConfig.direction === 'ascending' ? aValue - bValue : bValue - aValue;
    }
    return 0;
  });

  // Handle new product form inputs
  const handleInputChange = (e) => {
    setNewProduct({
      ...newProduct,
      [e.target.name]: e.target.value,
    });
  };

  // Add new product
  const handleAddProduct = () => {
    if (
      newProduct.product &&
      newProduct.category &&
      newProduct.sale_price &&
      newProduct.quantity
    ) {
      setProducts([...products, { ...newProduct, sale_price: parseFloat(newProduct.sale_price), market_price: parseFloat(newProduct.market_price), quantity: parseInt(newProduct.quantity) }]);
      setNewProduct({
        index: products.length + 2,
        product: '',
        category: '',
        sub_category: '',
        brand: '',
        sale_price: '',
        market_price: '',
        type: '',
        rating: '',
        description: '',
        quantity: '',
      });
    } else {
      alert("Please fill in all required fields.");
    }
  };

  // Delete product
  const handleDeleteProduct = (index) => {
    const updatedProducts = products.filter((_, i) => i !== index);
    setProducts(updatedProducts);
  };

  // CSV headers and data
  const headers = [
    { label: 'Index', key: 'index' },
    { label: 'Product', key: 'product' },
    { label: 'Category', key: 'category' },
    { label: 'Sub-Category', key: 'sub_category' },
    { label: 'Brand', key: 'brand' },
    { label: 'Sale Price', key: 'sale_price' },
    { label: 'Market Price', key: 'market_price' },
    { label: 'Type', key: 'type' },
    { label: 'Rating', key: 'rating' },
    { label: 'Description', key: 'description' },
    { label: 'Quantity', key: 'quantity' },
  ];

  return (
    <div className="container mx-auto mt-10 p-4">
      <h3 className="text-xl font-semibold mb-4">Product List</h3>

      {/* CSV Download Button */}
      <CSVLink
        data={products}
        headers={headers}
        filename="product_list.csv"
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mb-4 inline-block"
      >
        Download CSV
      </CSVLink>

      {/* Form to add a new product */}
      <div className="mb-6">
        {['product', 'category', 'sub_category', 'brand', 'sale_price', 'market_price', 'type', 'rating', 'description', 'quantity'].map((field, index) => (
          <input
            key={index}
            type="text"
            name={field}
            placeholder={field.replace('_', ' ').toUpperCase()}
            value={newProduct[field]}
            onChange={handleInputChange}
            className="border p-2 mr-2 mb-2"
          />
        ))}
        <button
          onClick={handleAddProduct}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Add Product
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 shadow-md rounded-lg">
          <thead>
            <tr className="bg-gray-100 text-left">
              {headers.map((col, index) => (
                <th
                  key={index}
                  className="p-3 cursor-pointer"
                  onClick={() => handleSort(col.key)}
                >
                  {col.label} <FontAwesomeIcon icon={faSort} />
                </th>
              ))}
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedProducts.map((product, index) => (
              <tr key={index} className="border-t">
                <td className="p-3">{product.index}</td>
                <td className="p-3">{product.product}</td>
                <td className="p-3">{product.category}</td>
                <td className="p-3">{product.sub_category}</td>
                <td className="p-3">{product.brand}</td>
                <td className="p-3">${product.sale_price.toFixed(2)}</td>
                <td className="p-3">${product.market_price.toFixed(2)}</td>
                <td className="p-3">{product.type}</td>
                <td className="p-3">{product.rating}</td>
                <td className="p-3">{product.description}</td>
                <td className="p-3">{product.quantity}</td>
                <td className="p-3">
                  <button
                    onClick={() => handleDeleteProduct(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <FontAwesomeIcon icon={faTrashAlt} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductTable;
