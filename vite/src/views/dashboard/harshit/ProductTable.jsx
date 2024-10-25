import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEdit, faTrashAlt, faSave, faSort } from '@fortawesome/free-solid-svg-icons';

const initialProducts = [
  { name: 'Macbook pro', sku: 'PT001', category: 'Computers', price: 1500, unit: 'pc', qty: 100, createdBy: 'Admin' },
  { name: 'Orange', sku: 'PT002', category: 'Fruits', price: 10, unit: 'pc', qty: 100, createdBy: 'Admin' },
  // Add more products here...
];

const ProductTable = () => {
  const [products, setProducts] = useState(initialProducts);
  const [newProduct, setNewProduct] = useState({
    name: '', sku: '', category: '', price: '', unit: '', qty: '', createdBy: 'Admin',
  });
  const [editIndex, setEditIndex] = useState(null);
  const [editQty, setEditQty] = useState('');
  const [showForm, setShowForm] = useState(false); // State to control form visibility
  const [searchTerm, setSearchTerm] = useState(''); // State to handle search
  const [sortConfig, setSortConfig] = useState({ key: '', direction: '' }); // State for sorting

  // Handle change in input for adding new product
  const handleInputChange = (e) => {
    setNewProduct({
      ...newProduct,
      [e.target.name]: e.target.value,
    });
  };

  // Add new product
  const handleAddProduct = () => {
    if (newProduct.name && newProduct.sku && newProduct.category && newProduct.price && newProduct.qty) {
      setProducts([...products, { ...newProduct, price: parseFloat(newProduct.price), qty: parseInt(newProduct.qty) }]);
      setNewProduct({
        name: '', sku: '', category: '', price: '', unit: '', qty: '', createdBy: 'Admin',
      });
      setShowForm(false); // Hide form after adding the product
    } else {
      alert("Please fill in all fields.");
    }
  };

  // Edit product quantity
  const handleEditQty = (index) => {
    setEditIndex(index);
    setEditQty(products[index].qty);
  };

  const handleSaveQty = (index) => {
    const updatedProducts = [...products];
    updatedProducts[index].qty = parseInt(editQty);
    setProducts(updatedProducts);
    setEditIndex(null); // Reset the edit state
  };

  // Delete product
  const handleDeleteProduct = (index) => {
    const updatedProducts = products.filter((_, i) => i !== index);
    setProducts(updatedProducts);
  };

  // Handle search term
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  // Sorting function
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

  // Filtered and sorted products
  const filteredProducts = sortedProducts.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto mt-10 p-4">
      <div className="flex justify-between mb-4">
        <h3 className="text-xl font-semibold">Product List</h3>
        <input
          type="text"
          placeholder="Search by name, SKU, or category..."
          value={searchTerm}
          onChange={handleSearch}
          className="border p-2 mr-2"
        />
        <button
          className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600"
          onClick={() => setShowForm(!showForm)} // Toggle form visibility
        >
          {showForm ? 'Cancel' : '+ Add New Product'}
        </button>
      </div>

      {showForm && (
        <div className="mb-6">
          {/* Form inputs */}
          <input
            type="text"
            name="name"
            placeholder="Product Name"
            value={newProduct.name}
            onChange={handleInputChange}
            className="border p-2 mr-2"
          />
          <input
            type="text"
            name="sku"
            placeholder="SKU"
            value={newProduct.sku}
            onChange={handleInputChange}
            className="border p-2 mr-2"
          />
          <input
            type="text"
            name="category"
            placeholder="Category"
            value={newProduct.category}
            onChange={handleInputChange}
            className="border p-2 mr-2"
          />
          <input
            type="number"
            name="price"
            placeholder="Price"
            value={newProduct.price}
            onChange={handleInputChange}
            className="border p-2 mr-2"
          />
          <input
            type="text"
            name="unit"
            placeholder="Unit"
            value={newProduct.unit}
            onChange={handleInputChange}
            className="border p-2 mr-2"
          />
          <input
            type="number"
            name="qty"
            placeholder="Quantity"
            value={newProduct.qty}
            onChange={handleInputChange}
            className="border p-2 mr-2"
          />
          <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600" onClick={handleAddProduct}>
            Add Product
          </button>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 shadow-md rounded-lg">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-3 cursor-pointer" onClick={() => handleSort('name')}>
                Product Name <FontAwesomeIcon icon={faSort} />
              </th>
              <th className="p-3 cursor-pointer" onClick={() => handleSort('sku')}>
                SKU <FontAwesomeIcon icon={faSort} />
              </th>
              <th className="p-3 cursor-pointer" onClick={() => handleSort('category')}>
                Category <FontAwesomeIcon icon={faSort} />
              </th>
              <th className="p-3 cursor-pointer" onClick={() => handleSort('price')}>
                Price <FontAwesomeIcon icon={faSort} />
              </th>
              <th className="p-3">Unit</th>
              <th className="p-3 cursor-pointer" onClick={() => handleSort('qty')}>
                Qty <FontAwesomeIcon icon={faSort} />
              </th>
              <th className="p-3">Created By</th>
              <th className="p-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((product, index) => (
              <tr key={index} className="border-t">
                <td className="p-3">{product.name}</td>
                <td className="p-3">{product.sku}</td>
                <td className="p-3">{product.category}</td>
                <td className="p-3">{product.price.toFixed(2)}</td>
                <td className="p-3">{product.unit}</td>
                <td className="p-3">
                  {editIndex === index ? (
                    <input
                      type="number"
                      value={editQty}
                      onChange={(e) => setEditQty(parseInt(e.target.value))}
                      className="border p-1"
                    />
                  ) : (
                    product.qty
                  )}
                </td>
                <td className="p-3">{product.createdBy}</td>
                <td className="p-3 flex space-x-2">
                  {editIndex === index ? (
                    <button
                      onClick={() => handleSaveQty(index)}
                      className="text-green-500 hover:text-green-700"
                    >
                      <FontAwesomeIcon icon={faSave} />
                    </button>
                  ) : (
                    <button
                      onClick={() => handleEditQty(index)}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      <FontAwesomeIcon icon={faEdit} />
                    </button>
                  )}
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
