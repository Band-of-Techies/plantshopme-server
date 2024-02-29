import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Notification.css'; // Import CSS file for styling
import { FaTimes, FaBell } from 'react-icons/fa'; // Import icons for notification and close button

const NotificationComponent = () => {
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    // Fetch notifications with status not equal to 'not'
    axios.get(`${process.env.REACT_APP_BASE_URL}/Notification`)
      .then(response => {
        setNotifications(response.data);
      })
      .catch(error => {
        console.error('Error fetching notifications:', error);
      });
  }, []);

  const handleMarkAsRead = (orderId) => {
    // Update the status of the notification to 'seen'
    axios.put(`${process.env.REACT_APP_BASE_URL}/Notification/${orderId}`)
      .then(response => {
        // Remove the notification from the list
        setNotifications(notifications.filter(notification => notification !== orderId));
      })
      .catch(error => {
        console.error('Error marking notification as read:', error);
      });
  };

  const handleCloseNotifications = () => {
    setShowNotifications(false);
  };

  return (
    <div className="notification-container">
      {showNotifications && (
        <div className="notification-overlay">
          <button className="close-button" onClick={handleCloseNotifications}>
            <FaTimes className="close-icon" />
          </button>
          <div className="notification-card-container">
            {notifications.map(notification => (
              <div key={notification} className="notification-card">
                <p className="notification-text">{notification}</p>
                <button className="mark-as-read-button" onClick={() => handleMarkAsRead(notification)}>Mark as Read</button>
              </div>
            ))}
          </div>
        </div>
      )}
      <button className="notification-button" onClick={() => setShowNotifications(!showNotifications)}>
        <FaBell className="notification-icon" />
        <span className="notification-count">{notifications.length}</span> {/* Display total count */}
      </button>
    </div>
  );
};

export default NotificationComponent;
