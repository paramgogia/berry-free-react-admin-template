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
{
  index: 3,
  product: "Organic Turmeric Powder",
  category: "Grocery",
  sub_category: "Spices & Masalas",
  brand: "24 Mantra Organic",
  sale_price: 150.0,
  market_price: 160.0,
  type: "Spices",
  rating: 4.5,
  description: "Pure and organic turmeric powder...",
  quantity: 50,
},
{
  index: 4,
  product: "Almonds - 500g",
  category: "Grocery",
  sub_category: "Dry Fruits",
  brand: "Nutty Gritties",
  sale_price: 600.0,
  market_price: 650.0,
  type: "Dry Fruits",
  rating: 4.7,
  description: "High-quality almonds packed with nutrition...",
  quantity: 30,
},
{
  index: 5,
  product: "Stainless Steel Knife Set",
  category: "Kitchen, Garden & Pets",
  sub_category: "Kitchen Tools",
  brand: "Prestige",
  sale_price: 1200.0,
  market_price: 1300.0,
  type: "Kitchen Tools",
  rating: 4.2,
  description: "Durable and sharp stainless steel knives...",
  quantity: 20,
},
{
  index: 6,
  product: "Yoga Mat - Blue",
  category: "Sports & Fitness",
  sub_category: "Fitness Accessories",
  brand: "Reebok",
  sale_price: 800.0,
  market_price: 850.0,
  type: "Fitness Accessories",
  rating: 4.8,
  description: "Comfortable and non-slip yoga mat...",
  quantity: 25,
},
{
  index: 7,
  product: "LED Desk Lamp",
  category: "Home & Decor",
  sub_category: "Lighting",
  brand: "Philips",
  sale_price: 1500.0,
  market_price: 1600.0,
  type: "Lighting",
  rating: 4.3,
  description: "Energy-efficient LED desk lamp...",
  quantity: 40,
},
{
  index: 8,
  product: "Bluetooth Headphones",
  category: "Electronics",
  sub_category: "Audio",
  brand: "Sony",
  sale_price: 3000.0,
  market_price: 3200.0,
  type: "Audio",
  rating: 4.6,
  description: "High-quality sound with noise cancellation...",
  quantity: 15,
},
{
  index: 9,
  product: "Running Shoes - Black",
  category: "Sports & Fitness",
  sub_category: "Footwear",
  brand: "Nike",
  sale_price: 5000.0,
  market_price: 5500.0,
  type: "Footwear",
  rating: 4.9,
  description: "Comfortable and durable running shoes...",
  quantity: 10,
},
{
  index: 10,
  product: "Ceramic Dinner Set",
  category: "Home & Decor",
  sub_category: "Dining",
  brand: "Corelle",
  sale_price: 2500.0,
  market_price: 2700.0,
  type: "Dining",
  rating: 4.4,
  description: "Elegant and durable ceramic dinner set...",
  quantity: 12,
},
{
  index: 11,
  product: "Organic Honey - 250g",
  category: "Grocery",
  sub_category: "Sweeteners",
  brand: "Dabur",
  sale_price: 200.0,
  market_price: 220.0,
  type: "Sweeteners",
  rating: 4.7,
  description: "Pure and organic honey...",
  quantity: 35,
},
{
  index: 12,
  product: "Cotton Bath Towel",
  category: "Home & Decor",
  sub_category: "Bath",
  brand: "Bombay Dyeing",
  sale_price: 400.0,
  market_price: 450.0,
  type: "Bath",
  rating: 4.5,
  description: "Soft and absorbent cotton bath towel...",
  quantity: 28,
}
];

const Purchase = () => {
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

export default Purchase;
