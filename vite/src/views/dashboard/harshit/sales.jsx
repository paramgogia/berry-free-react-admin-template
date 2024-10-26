import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSort, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { CSVLink } from 'react-csv';

const initialData = [
  {
    Unnamed: 0,
    transaction_id: '02-03-2022 09:51',
    timestamp: '02-03-2022 09:51',
    product_id: 'Fruits & Vegetables',
    category: 'gold',
    customer_type: 3.99,
    unit_price: 2,
    quantity: 7.98,
    total: 'e-wallet',
  },
  {
    Unnamed: 1,
    transaction_id: '02-03-2022 10:15',
    timestamp: '02-03-2022 10:15',
    product_id: 'Dairy',
    category: 'silver',
    customer_type: 5.99,
    unit_price: 1,
    quantity: 5.99,
    total: 'credit card',
  },
  {
    Unnamed: 2,
    transaction_id: '02-03-2022 11:20',
    timestamp: '02-03-2022 11:20',
    product_id: 'Bakery',
    category: 'bronze',
    customer_type: 2.99,
    unit_price: 3,
    quantity: 8.97,
    total: 'cash',
  },
  {
    Unnamed: 3,
    transaction_id: '02-03-2022 12:30',
    timestamp: '02-03-2022 12:30',
    product_id: 'Meat',
    category: 'gold',
    customer_type: 7.99,
    unit_price: 4,
    quantity: 31.96,
    total: 'e-wallet',
  },
  {
    Unnamed: 4,
    transaction_id: '02-03-2022 13:45',
    timestamp: '02-03-2022 13:45',
    product_id: 'Seafood',
    category: 'silver',
    customer_type: 9.99,
    unit_price: 2,
    quantity: 19.98,
    total: 'credit card',
  },
  {
    Unnamed: 5,
    transaction_id: '02-03-2022 14:50',
    timestamp: '02-03-2022 14:50',
    product_id: 'Beverages',
    category: 'bronze',
    customer_type: 1.99,
    unit_price: 5,
    quantity: 9.95,
    total: 'cash',
  },
  {
    Unnamed: 6,
    transaction_id: '02-03-2022 15:10',
    timestamp: '02-03-2022 15:10',
    product_id: 'Snacks',
    category: 'gold',
    customer_type: 3.49,
    unit_price: 3,
    quantity: 10.47,
    total: 'e-wallet',
  },
  {
    Unnamed: 7,
    transaction_id: '02-03-2022 16:25',
    timestamp: '02-03-2022 16:25',
    product_id: 'Frozen Foods',
    category: 'silver',
    customer_type: 4.99,
    unit_price: 2,
    quantity: 9.98,
    total: 'credit card',
  },
  {
    Unnamed: 8,
    transaction_id: '02-03-2022 17:35',
    timestamp: '02-03-2022 17:35',
    product_id: 'Canned Goods',
    category: 'bronze',
    customer_type: 2.49,
    unit_price: 4,
    quantity: 9.96,
    total: 'cash',
  },
  {
    Unnamed: 9,
    transaction_id: '02-03-2022 18:45',
    timestamp: '02-03-2022 18:45',
    product_id: 'Dry Goods',
    category: 'gold',
    customer_type: 6.99,
    unit_price: 3,
    quantity: 20.97,
    total: 'e-wallet',
  },
  {
    Unnamed: 10,
    transaction_id: '02-03-2022 19:55',
    timestamp: '02-03-2022 19:55',
    product_id: 'Condiments',
    category: 'silver',
    customer_type: 3.99,
    unit_price: 2,
    quantity: 7.98,
    total: 'credit card',
  },
  {
    Unnamed: 11,
    transaction_id: '02-03-2022 20:05',
    timestamp: '02-03-2022 20:05',
    product_id: 'Spices',
    category: 'bronze',
    customer_type: 1.49,
    unit_price: 5,
    quantity: 7.45,
    total: 'cash',
  },
  {
    Unnamed: 12,
    transaction_id: '02-03-2022 21:15',
    timestamp: '02-03-2022 21:15',
    product_id: 'Grains',
    category: 'gold',
    customer_type: 4.49,
    unit_price: 3,
    quantity: 13.47,
    total: 'e-wallet',
  },
  {
    Unnamed: 13,
    transaction_id: '02-03-2022 22:25',
    timestamp: '02-03-2022 22:25',
    product_id: 'Pasta',
    category: 'silver',
    customer_type: 2.99,
    unit_price: 2,
    quantity: 5.98,
    total: 'credit card',
  },
  {
    Unnamed: 14,
    transaction_id: '02-03-2022 23:35',
    timestamp: '02-03-2022 23:35',
    product_id: 'Sauces',
    category: 'bronze',
    customer_type: 3.99,
    unit_price: 4,
    quantity: 15.96,
    total: 'cash',
  },
  {
    Unnamed: 15,
    transaction_id: '02-03-2022 23:55',
    timestamp: '02-03-2022 23:55',
    product_id: 'Oils',
    category: 'gold',
    customer_type: 5.49,
    unit_price: 3,
    quantity: 16.47,
    total: 'e-wallet',
  },
  {
    Unnamed: 16,
    transaction_id: '03-03-2022 00:15',
    timestamp: '03-03-2022 00:15',
    product_id: 'Vinegars',
    category: 'silver',
    customer_type: 2.49,
    unit_price: 2,
    quantity: 4.98,
    total: 'credit card',
  },
  {
    Unnamed: 17,
    transaction_id: '03-03-2022 01:25',
    timestamp: '03-03-2022 01:25',
    product_id: 'Baking Supplies',
    category: 'bronze',
    customer_type: 1.99,
    unit_price: 5,
    quantity: 9.95,
    total: 'cash',
  },
  {
    Unnamed: 18,
    transaction_id: '03-03-2022 02:35',
    timestamp: '03-03-2022 02:35',
    product_id: 'Breakfast Foods',
    category: 'gold',
    customer_type: 4.99,
    unit_price: 3,
    quantity: 14.97,
    total: 'e-wallet',
  },
  {
    Unnamed: 19,
    transaction_id: '03-03-2022 03:45',
    timestamp: '03-03-2022 03:45',
    product_id: 'Baby Foods',
    category: 'silver',
    customer_type: 3.49,
    unit_price: 2,
    quantity: 6.98,
    total: 'credit card',
  },
  {
    Unnamed: 20,
    transaction_id: '03-03-2022 04:55',
    timestamp: '03-03-2022 04:55',
    product_id: 'Pet Foods',
    category: 'bronze',
    customer_type: 2.99,
    unit_price: 4,
    quantity: 11.96,
    total: 'cash',
  }
  // (add more entries as per your dataset)
];

const Sales = () => {
  const [products, setProducts] = useState(initialData);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [sortConfig, setSortConfig] = useState({ key: '', direction: '' });

  // Pagination control
  const indexOfLastProduct = currentPage * itemsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - itemsPerPage;
  const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);

  // Handle sorting
  const handleSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const sortedProducts = [...currentProducts].sort((a, b) => {
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

  // CSV headers and data
  const headers = [
    { label: 'Unnamed', key: 'Unnamed' },
    { label: 'Transaction ID', key: 'transaction_id' },
    { label: 'Timestamp', key: 'timestamp' },
    { label: 'Product ID', key: 'product_id' },
    { label: 'Category', key: 'category' },
    { label: 'Customer Type', key: 'customer_type' },
    { label: 'Unit Price', key: 'unit_price' },
    { label: 'Quantity', key: 'quantity' },
    { label: 'Total', key: 'total' },
  ];

  return (
    <div className="container mx-auto mt-10 p-4">
      <h3 className="text-xl font-semibold mb-4">Sales Data</h3>
      
      <CSVLink
        data={products}
        headers={headers}
        filename="sales_data.csv"
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mb-4 inline-block"
      >
        Download CSV
      </CSVLink>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 shadow-md rounded-lg">
          <thead>
            <tr className="bg-gray-100 text-left">
              {headers.map((header) => (
                <th
                  key={header.key}
                  className="p-3 cursor-pointer"
                  onClick={() => handleSort(header.key)}
                >
                  {header.label} <FontAwesomeIcon icon={faSort} />
                </th>
              ))}
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedProducts.map((product, index) => (
              <tr key={index} className="border-t">
                <td className="p-3">{product.Unnamed}</td>
                <td className="p-3">{product.transaction_id}</td>
                <td className="p-3">{product.timestamp}</td>
                <td className="p-3">{product.product_id}</td>
                <td className="p-3">{product.category}</td>
                <td className="p-3">{product.customer_type}</td>
                <td className="p-3">{product.unit_price}</td>
                <td className="p-3">{product.quantity}</td>
                <td className="p-3">{product.total}</td>
                <td className="p-3 flex space-x-2">
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

      <div className="flex justify-between mt-4">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(currentPage - 1)}
          className="bg-gray-300 px-4 py-2 rounded"
        >
          Previous
        </button>
        <button
          disabled={currentPage === Math.ceil(products.length / itemsPerPage)}
          onClick={() => setCurrentPage(currentPage + 1)}
          className="bg-gray-300 px-4 py-2 rounded"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Sales;
