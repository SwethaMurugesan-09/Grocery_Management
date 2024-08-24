import React, { useState } from 'react';
import './Addproduct.css';
import upload from '../../assets/upload.png';

const AddProduct = () => {
    const [image, setImage] = useState(null);
    const [productDetails, setProductDetails] = useState({
        name: "",
        image: "",
        category: "",
        price: ""
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const imageHandler = (e) => {
        setImage(e.target.files[0]);
    };

    const changeHandler = (e) => {
        setProductDetails({ ...productDetails, [e.target.name]: e.target.value });
    };

    const addProduct = async () => {
        setLoading(true);
        setError(null);
        let formData = new FormData();
        if (image) {
            formData.append('image', image);
        }

        formData.append('name', productDetails.name);
        formData.append('category', productDetails.category);
        formData.append('pricePerKg', productDetails.price);

        try {
            const uploadResponse = await fetch('http://localhost:5000/upload', {
                method: 'POST',
                body: formData
            });

            if (!uploadResponse.ok) {
                throw new Error('Image upload failed');
            }

            const uploadData = await uploadResponse.json();
            if (uploadData.success) {
                const addProductResponse = await fetch('http://localhost:5000/addproduct', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        name: productDetails.name,
                        image: uploadData.image_url,
                        category: productDetails.category,
                        pricePerKg: productDetails.price
                    })
                });

                if (!addProductResponse.ok) {
                    throw new Error('Failed to add product');
                }

                const addProductData = await addProductResponse.json();
                if (addProductData.success) {
                    alert('Product added successfully');
                } else {
                    throw new Error('Failed to add product');
                }
            }
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='addproduct'>
            {error && <p className='error'>{error}</p>}
            <div className="addproduct-itemfield">
                <p>Product title</p>
                <input
                    value={productDetails.name}
                    onChange={changeHandler}
                    type='text'
                    name="name"
                    placeholder='Type here'
                />
            </div>
            <div className="addproduct-price">
                <div className="addproduct-itemfield">
                    <p>Price</p>
                    <input
                        value={productDetails.price}
                        onChange={changeHandler}
                        type='text'
                        name="price"
                        placeholder='Type here'
                    />
                </div>
            </div>
            <div className="addproduct-itemfield">
                <p>Product Category</p>
                <select
                    value={productDetails.category}
                    onChange={changeHandler}
                    name="category"
                    className='add-product-selector'
                >
                    <option value="vegetables">Vegetables</option>
                    <option value="fruits">Fruits</option>
                    <option value="dryfruits">Dryfruits</option>
                </select>
            </div>
            <div className="addproduct-itemfield">
                <label htmlFor='file-input'>
                    <img
                        src={image ? URL.createObjectURL(image) : upload}
                        className='addproduct-img'
                        alt="Upload"
                    />
                </label>
                <input
                    onChange={imageHandler}
                    type="file"
                    name="image"
                    id="file-input"
                    hidden
                />
            </div>
            <button
                onClick={addProduct}
                className='addproduct-btn'
                disabled={loading}
            >
                {loading ? 'Adding...' : 'ADD'}
            </button>
        </div>
    );
};

export default AddProduct;
