import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './EditableTop.css';

const EditableTop = () => {
    const [content, setContent] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        // Fetch initial content when component mounts
        fetchContent();
    }, []);

    const fetchContent = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_BASE_URL}/getEditable`);
            if (!response.ok) {
                throw new Error('Failed to fetch content');
            }
            const data = await response.json();
            setContent(data.content); // Set content directly as it's a string
        } catch (error) {
            console.error(error);
            toast.error('Failed to fetch content');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const response = await fetch(`${process.env.REACT_APP_BASE_URL}/Editable`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ content }) // Send content as string, not array
            });
            if (!response.ok) {
                throw new Error('Failed to update content');
            }
            // Content updated successfully, show success message
            toast.success('Content updated successfully');
        } catch (error) {
            console.error(error);
            toast.error('Failed to update content');
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (e) => {
        setContent(e.target.value);
    };

    return (
        <div className="editable-top">
            <h2>Top Content</h2>
            <form onSubmit={handleSubmit}>
                <textarea
                    className="content-textarea"
                    value={content}
                    onChange={handleChange}
                    rows={6}
                    cols={50} 
                    disabled={isLoading}
                />
                <br />
                <button className="submit-button" type="submit" disabled={isLoading}>
                    {isLoading ? 'Updating...' : 'Update Content'}
                </button>
            </form>
            <ToastContainer />
        </div>
    );
};

export default EditableTop;
