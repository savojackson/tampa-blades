import './App.css'

import EmojiPicker from 'emoji-picker-react'
import L from 'leaflet'
import React, { createContext, useContext, useEffect, useState } from 'react'
import {
    Badge, Button, Carousel, Col, Container, Dropdown, Form, ListGroup, Modal, Nav, Navbar, Row,
    Tab, Table, Tabs
} from 'react-bootstrap'
import {
    CircleMarker, MapContainer, Marker, Polyline, Popup, TileLayer, useMapEvents
} from 'react-leaflet'
import {
    BrowserRouter as Router, Link, Navigate, Route, Routes, useLocation, useMatch, useNavigate
} from 'react-router-dom'

import { GiphyFetch } from '@giphy/js-fetch-api'
import { Grid as GiphyGrid } from '@giphy/react-components'

import { API_ENDPOINTS, apiRequest, buildApiUrl, buildMediaUrl } from './config/api'
import logo from './logo.svg'

const Landing = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [upcomingEvents, setUpcomingEvents] = React.useState<any[]>([]);
  const [loadingEvents, setLoadingEvents] = React.useState(true);

  // Fetch upcoming events from API
  React.useEffect(() => {
    const fetchUpcomingEvents = async () => {
      try {
        const response = await fetch('http://localhost:4000/api/events');
        const data = await response.json();

        // Filter for upcoming events (next 30 days)
        const now = new Date();
        const thirtyDaysFromNow = new Date(now.getTime() + (30 * 24 * 60 * 60 * 1000));

        const upcoming = data.events?.filter((event: any) => {
          const eventDate = new Date(event.date);
          return eventDate >= now && eventDate <= thirtyDaysFromNow;
        }).slice(0, 3) || [];

        setUpcomingEvents(upcoming);
      } catch (error) {
        console.error('Failed to fetch upcoming events:', error);
        // Fallback to sample data if API fails
        setUpcomingEvents([
          {
            id: 1,
            title: "Friday Night Skate",
            date: "Dec 15, 2024",
            startTime: "19:00",
            endTime: "21:00",
            location: "Bayshore Blvd",
            eventType: "meetup",
            image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=400&q=80"
          },
          {
            id: 2,
            title: "Skate Park Meetup",
            date: "Dec 18, 2024",
            startTime: "17:00",
            endTime: "19:00",
            location: "Tampa Skate Park",
            eventType: "meetup",
            image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=400&q=80"
          },
          {
            id: 3,
            title: "Beginner's Session",
            date: "Dec 20, 2024",
            startTime: "18:00",
            endTime: "20:00",
            location: "Community Center",
            eventType: "workshop",
            image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=400&q=80"
          }
        ]);
      } finally {
        setLoadingEvents(false);
      }
    };

    fetchUpcomingEvents();
  }, []);

  const communityStats = [
    { label: "Active Members", value: "500+", icon: "bi-people-fill", color: "primary" },
    { label: "Events This Month", value: "12", icon: "bi-calendar-event", color: "success" },
    { label: "Skate Spots", value: "25+", icon: "bi-geo-alt", color: "info" },
    { label: "Years Strong", value: "5+", icon: "bi-award", color: "warning" }
  ];

  const quickActions = [
    {
      title: "Browse Events",
      description: "Find upcoming skating events and meetups",
      icon: "bi-calendar-event",
      color: "primary",
      link: "/events",
      requiresAuth: false
    },
    {
      title: "Meet Members",
      description: "Connect with fellow skaters in the community",
      icon: "bi-people",
      color: "success",
      link: "/profiles",
      requiresAuth: true
    },
    {
      title: "Skate Spots",
      description: "Discover the best places to skate in your area",
      icon: "bi-map",
      color: "info",
      link: "/maps",
      requiresAuth: true
    },
    {
      title: "Community Chat",
      description: "Join conversations with other skaters",
      icon: "bi-chat-dots",
      color: "warning",
      link: "/chat",
      requiresAuth: true
    }
  ];

  return (
    <div className="landing-page">
      {/* Welcome Section */}
      <section className="welcome-section mb-5">
        <div className="row align-items-center">
          <div className="col-lg-6">
            <h1 className="display-4 fw-bold mb-3">
              Welcome to <span className="text-primary">Skate Community</span>
            </h1>
            <p className="lead mb-4">
              The premier roller skating community. Connect with fellow skaters,
              discover amazing events, and share your passion for skating.
            </p>
            {!user && (
              <div className="d-flex gap-3">
                <Button variant="primary" size="lg" onClick={() => navigate('/login')}>
                  <i className="bi bi-box-arrow-in-right me-2"></i>
                  Join Community
                </Button>
                <Button variant="outline-primary" size="lg" onClick={() => navigate('/events')}>
                  <i className="bi bi-calendar-event me-2"></i>
                  Browse Events
                </Button>
              </div>
            )}
          </div>
          <div className="col-lg-6">
            <div className="welcome-image">
              <img
                src="https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=600&q=80"
                alt="Roller Skating Community"
                className="img-fluid rounded-3 shadow"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Community Statistics */}
      <section className="stats-section mb-5">
        <div className="row">
          {communityStats.map((stat, index) => (
            <div key={index} className="col-lg-3 col-md-6 mb-4">
              <div className="stat-card text-center p-4">
                <div className={`stat-icon mb-3 text-${stat.color}`}>
                  <i className={`bi ${stat.icon} fs-1`}></i>
                </div>
                <h3 className="stat-number fw-bold mb-2">{stat.value}</h3>
                <p className="stat-label text-muted mb-0">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Quick Actions */}
      <section className="quick-actions mb-5">
        <h2 className="section-title mb-4">Quick Actions</h2>
        <div className="row">
          {quickActions.map((action, index) => (
            <div key={index} className="col-lg-3 col-md-6 mb-4">
              <div className="action-card h-100">
                <div className="card h-100 border-0 shadow-sm">
                  <div className="card-body text-center p-4">
                    <div className={`action-icon mb-3 text-${action.color}`}>
                      <i className={`bi ${action.icon} fs-1`}></i>
                    </div>
                    <h5 className="card-title mb-3">{action.title}</h5>
                    <p className="card-text text-muted mb-4">{action.description}</p>
                    {action.requiresAuth && !user ? (
                      <Button variant="outline-secondary" size="sm" onClick={() => navigate('/login')}>
                        Login Required
                      </Button>
                    ) : (
                      <Button
                        variant={`outline-${action.color}`}
                        size="sm"
                        onClick={() => navigate(action.link)}
                      >
                        Explore
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="upcoming-events mb-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="section-title mb-0">Upcoming Events</h2>
          <Button variant="outline-primary" onClick={() => navigate('/events')}>
            View All Events
          </Button>
        </div>
        <div className="row">
          {loadingEvents ? (
            <div className="col-12 text-center">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : upcomingEvents.length === 0 ? (
            <div className="col-12 text-center">
              <p className="text-muted">No upcoming events at the moment.</p>
              <Button variant="primary" onClick={() => navigate('/events')}>
                Browse All Events
              </Button>
            </div>
          ) : (
            upcomingEvents.map((event) => (
              <div key={event.id} className="col-lg-4 col-md-6 mb-4">
                <div className="event-card">
                  <div className="card h-100 border-0 shadow-sm">
                    <img
                      src={event.eventPhoto ? buildMediaUrl(event.eventPhoto) : event.image}
                      className="card-img-top"
                      alt={event.title}
                      style={{ height: '200px', objectFit: 'cover' }}
                    />
                    <div className="card-body p-4">
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <h5 className="card-title mb-0">{event.title}</h5>
                        <span className={`badge bg-${event.eventType === 'competition' ? 'danger' : event.eventType === 'workshop' ? 'info' : 'success'}`}>
                          {event.eventType}
                        </span>
                      </div>
                      <div className="event-details mb-3">
                        <div className="d-flex align-items-center mb-2">
                          <i className="bi bi-calendar3 text-primary me-2"></i>
                          <span className="text-muted">
                            {new Date(event.date).toLocaleDateString()} at {event.startTime} - {event.endTime}
                          </span>
                        </div>
                        <div className="d-flex align-items-center mb-2">
                          <i className="bi bi-geo-alt text-primary me-2"></i>
                          <span className="text-muted">{event.location}</span>
                        </div>
                        {event.skillLevel && (
                          <div className="d-flex align-items-center mb-2">
                            <i className="bi bi-person-check text-primary me-2"></i>
                            <span className="text-muted">{event.skillLevel} level</span>
                          </div>
                        )}
                        {event.cost && (
                          <div className="d-flex align-items-center mb-2">
                            <i className="bi bi-currency-dollar text-primary me-2"></i>
                            <span className="text-muted">{event.cost}</span>
                          </div>
                        )}
                      </div>
                      <Button variant="primary" size="sm" onClick={() => navigate('/events')}>
                        Learn More
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* Community Highlights */}
      <section className="community-highlights mb-5">
        <h2 className="section-title mb-4">Community Highlights</h2>
        <div className="row">
          <div className="col-lg-6 mb-4">
            <div className="highlight-card">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body p-4">
                  <div className="d-flex align-items-center mb-3">
                    <div className="highlight-icon me-3">
                      <i className="bi bi-star-fill text-warning fs-4"></i>
                    </div>
                    <h5 className="card-title mb-0">Featured Member</h5>
                  </div>
                  <p className="card-text">
                    Meet Sarah Johnson, our featured member of the month! Sarah has been skating
                    for 8 years and loves teaching beginners. Check out her profile to learn more
                    about her skating journey.
                  </p>
                  <Button variant="outline-primary" size="sm" onClick={() => navigate('/profiles')}>
                    Meet Sarah
                  </Button>
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-6 mb-4">
            <div className="highlight-card">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body p-4">
                  <div className="d-flex align-items-center mb-3">
                    <div className="highlight-icon me-3">
                      <i className="bi bi-trophy-fill text-success fs-4"></i>
                    </div>
                    <h5 className="card-title mb-0">Recent Achievement</h5>
                  </div>
                  <p className="card-text">
                    Congratulations to our community for reaching 500+ active members!
                    This milestone represents the growing passion for roller skating worldwide.
                    Here's to many more years of skating together!
                  </p>
                  <Button variant="outline-success" size="sm" onClick={() => navigate('/profiles')}>
                    Join the Celebration
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      {!user && (
        <section className="cta-section">
          <div className="cta-card text-center p-5">
            <h2 className="mb-3">Ready to Join the Community?</h2>
            <p className="lead mb-4">
              Create your account today and start connecting with fellow skaters worldwide!
            </p>
            <div className="d-flex justify-content-center gap-3">
              <Button variant="primary" size="lg" onClick={() => navigate('/login')}>
                <i className="bi bi-person-plus me-2"></i>
                Sign Up Now
              </Button>
              <Button variant="outline-primary" size="lg" onClick={() => navigate('/events')}>
                <i className="bi bi-calendar-event me-2"></i>
                Browse Events
              </Button>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};
const Gallery = () => {
  const { user } = useAuth();
  const [photos, setPhotos] = React.useState<any[]>([]);
  const [myPhotos, setMyPhotos] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [activeTab, setActiveTab] = React.useState('community');
  const [currentPage, setCurrentPage] = React.useState(1);
  const [hasMore, setHasMore] = React.useState(true);
  const [selectedCategory, setSelectedCategory] = React.useState('all');
  const [searchTerm, setSearchTerm] = React.useState('');
  const [showUploadModal, setShowUploadModal] = React.useState(false);
  const [showPhotoModal, setShowPhotoModal] = React.useState(false);
  const [selectedPhoto, setSelectedPhoto] = React.useState<any>(null);
  const [uploadForm, setUploadForm] = React.useState({
    photoUrl: '',
    caption: '',
    category: 'general',
    tags: '',
    location: '',
    isPublic: true
  });

  const categories = [
    { value: 'all', label: 'All Photos' },
    { value: 'general', label: 'General' },
    { value: 'tricks', label: 'Tricks & Moves' },
    { value: 'events', label: 'Events' },
    { value: 'locations', label: 'Skate Spots' },
    { value: 'equipment', label: 'Equipment' },
    { value: 'lifestyle', label: 'Lifestyle' }
  ];

  const fetchPhotos = async (page = 1, reset = false) => {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '20'
      });

      if (selectedCategory !== 'all') {
        params.append('category', selectedCategory);
      }

      if (searchTerm) {
        params.append('search', searchTerm);
      }

      const response = await fetch(`${API_ENDPOINTS.GALLERY_PHOTOS}?${params}`);
      const data = await response.json();

      if (reset) {
        setPhotos(data.photos || []);
      } else {
        setPhotos(prev => [...prev, ...(data.photos || [])]);
      }

      setHasMore(data.pagination?.hasMore || false);
      setCurrentPage(page);
    } catch (error) {
      console.error('Failed to fetch photos:', error);
    }
  };

  const fetchMyPhotos = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:4000/api/gallery/photos/my', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      setMyPhotos(data.photos || []);
    } catch (error) {
      console.error('Failed to fetch my photos:', error);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:4000/api/gallery/photos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          ...uploadForm,
          tags: uploadForm.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
        })
      });

      if (response.ok) {
        setShowUploadModal(false);
        setUploadForm({
          photoUrl: '',
          caption: '',
          category: 'general',
          tags: '',
          location: '',
          isPublic: true
        });
        fetchPhotos(1, true);
        fetchMyPhotos();
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to upload photo');
      }
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Failed to upload photo');
    }
  };

  const handleLike = async (photoId: number) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:4000/api/gallery/photos/${photoId}/like`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.ok) {
        // Update the photo in both arrays
        const updatePhoto = (photo: any) =>
          photo.id === photoId
            ? { ...photo, like_count: photo.like_count + (photo.liked ? -1 : 1), liked: !photo.liked }
            : photo;

        setPhotos(prev => prev.map(updatePhoto));
        setMyPhotos(prev => prev.map(updatePhoto));
      }
    } catch (error) {
      console.error('Failed to like photo:', error);
    }
  };

  const handleDeletePhoto = async (photoId: number) => {
    if (!window.confirm('Are you sure you want to delete this photo?')) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:4000/api/gallery/photos/${photoId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.ok) {
        setPhotos(prev => prev.filter(photo => photo.id !== photoId));
        setMyPhotos(prev => prev.filter(photo => photo.id !== photoId));
      }
    } catch (error) {
      console.error('Failed to delete photo:', error);
    }
  };

  const openPhotoModal = (photo: any) => {
    setSelectedPhoto(photo);
    setShowPhotoModal(true);
  };

  React.useEffect(() => {
    fetchPhotos(1, true);
    if (user) {
      fetchMyPhotos();
    }
    setLoading(false);
  }, [selectedCategory, searchTerm]);

  const loadMore = () => {
    if (hasMore) {
      fetchPhotos(currentPage + 1);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="gallery-container">
      <div className="gallery-header">
        <h2 className="gallery-title">
          <i className="bi bi-images me-2"></i>
          Photo Gallery
        </h2>
        <p className="gallery-subtitle">Share your inline skating moments with the community</p>
      </div>

      {/* Search and Filter Bar */}
      <div className="gallery-controls mb-4">
        <Row className="align-items-center">
          <Col md={4}>
            <Form.Control
              type="text"
              placeholder="Search photos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </Col>
          <Col md={3}>
            <Form.Select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="category-select"
            >
              {categories.map(cat => (
                <option key={cat.value} value={cat.value}>{cat.label}</option>
              ))}
            </Form.Select>
          </Col>
          <Col md={3}>
            <Button
              variant="primary"
              onClick={() => setShowUploadModal(true)}
              className="upload-btn"
            >
              <i className="bi bi-cloud-upload me-2"></i>
              Upload Photo
            </Button>
          </Col>
          <Col md={2}>
            <Button
              variant="outline-secondary"
              onClick={() => setActiveTab(activeTab === 'community' ? 'my-photos' : 'community')}
              className="tab-toggle-btn"
            >
              {activeTab === 'community' ? 'My Photos' : 'Community'}
            </Button>
          </Col>
        </Row>
      </div>

      {/* Photo Grid */}
      <div className="photo-grid">
        {(activeTab === 'community' ? photos : myPhotos).map((photo) => (
          <div key={photo.id} className="photo-card">
            <div className="photo-image-container" onClick={() => openPhotoModal(photo)}>
              <img
                src={photo.photo_url}
                alt={photo.caption || 'Gallery photo'}
                className="photo-image"
                loading="lazy"
              />
              <div className="photo-overlay">
                <div className="photo-info">
                  <h6>{photo.caption || 'Untitled'}</h6>
                  <p>by {photo.author_name || 'Unknown'}</p>
                </div>
              </div>
            </div>
            <div className="photo-actions">
              <Button
                variant={photo.liked ? "danger" : "outline-secondary"}
                size="sm"
                onClick={() => handleLike(photo.id)}
                className="like-btn"
              >
                <i className={`bi ${photo.liked ? 'bi-heart-fill' : 'bi-heart'}`}></i>
                {photo.like_count || 0}
              </Button>
              <Button
                variant="outline-secondary"
                size="sm"
                onClick={() => openPhotoModal(photo)}
                className="view-btn"
              >
                <i className="bi bi-eye"></i>
              </Button>
              {activeTab === 'my-photos' && (
                <Button
                  variant="outline-danger"
                  size="sm"
                  onClick={() => handleDeletePhoto(photo.id)}
                  className="delete-btn"
                >
                  <i className="bi bi-trash"></i>
                </Button>
              )}
            </div>
            {photo.caption && (
              <div className="photo-caption">
                <p>{photo.caption}</p>
                {photo.location && (
                  <small className="text-muted">
                    <i className="bi bi-geo-alt me-1"></i>
                    {photo.location}
                  </small>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Load More Button */}
      {activeTab === 'community' && hasMore && (
        <div className="text-center mt-4">
          <Button variant="outline-primary" onClick={loadMore}>
            Load More Photos
          </Button>
        </div>
      )}

      {/* Upload Modal */}
      <Modal show={showUploadModal} onHide={() => setShowUploadModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Upload Photo</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleUpload}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Photo URL</Form.Label>
              <Form.Control
                type="url"
                placeholder="Enter photo URL (e.g., from Unsplash, Imgur, etc.)"
                value={uploadForm.photoUrl}
                onChange={(e) => setUploadForm({ ...uploadForm, photoUrl: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Caption</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Describe your photo..."
                value={uploadForm.caption}
                onChange={(e) => setUploadForm({ ...uploadForm, caption: e.target.value })}
              />
            </Form.Group>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Category</Form.Label>
                  <Form.Select
                    value={uploadForm.category}
                    onChange={(e) => setUploadForm({ ...uploadForm, category: e.target.value })}
                  >
                    {categories.slice(1).map(cat => (
                      <option key={cat.value} value={cat.value}>{cat.label}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Location</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Where was this taken?"
                    value={uploadForm.location}
                    onChange={(e) => setUploadForm({ ...uploadForm, location: e.target.value })}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="mb-3">
              <Form.Label>Tags (comma-separated)</Form.Label>
              <Form.Control
                type="text"
                placeholder="inline skating, tricks, fun, etc."
                value={uploadForm.tags}
                onChange={(e) => setUploadForm({ ...uploadForm, tags: e.target.value })}
              />
            </Form.Group>
            <Form.Check
              type="checkbox"
              label="Make this photo public"
              checked={uploadForm.isPublic}
              onChange={(e) => setUploadForm({ ...uploadForm, isPublic: e.target.checked })}
            />
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowUploadModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Upload Photo
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Photo View Modal */}
      <Modal show={showPhotoModal} onHide={() => setShowPhotoModal(false)} size="xl">
        <Modal.Header closeButton>
          <Modal.Title>{selectedPhoto?.caption || 'Photo'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedPhoto && (
            <div className="photo-modal-content">
              <img
                src={selectedPhoto.photo_url}
                alt={selectedPhoto.caption || 'Gallery photo'}
                className="modal-photo"
              />
              <div className="photo-details mt-3">
                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <h6>By {selectedPhoto.author_name || 'Unknown'}</h6>
                    {selectedPhoto.location && (
                      <p className="text-muted">
                        <i className="bi bi-geo-alt me-1"></i>
                        {selectedPhoto.location}
                      </p>
                    )}
                    {selectedPhoto.caption && (
                      <p>{selectedPhoto.caption}</p>
                    )}
                  </div>
                  <div className="photo-stats">
                    <Button
                      variant={selectedPhoto.liked ? "danger" : "outline-secondary"}
                      size="sm"
                      onClick={() => handleLike(selectedPhoto.id)}
                    >
                      <i className={`bi ${selectedPhoto.liked ? 'bi-heart-fill' : 'bi-heart'}`}></i>
                      {selectedPhoto.like_count || 0}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
};
const Admin = () => {
  const { role } = useAuth();

  if (role === 'super_admin') {
    return <SuperAdmin />;
  }

  return (
    <div>
      <h2>Admin Dashboard</h2>
      <Tabs defaultActiveKey="users" className="mb-3">
        <Tab eventKey="users" title="Manage Users">
          <p>List, edit, and remove users here. (To be implemented)</p>
        </Tab>
        <Tab eventKey="invitations" title="Invitations">
          <p>Send and manage invitations here. (To be implemented)</p>
        </Tab>
      </Tabs>
    </div>
  );
};

const SuperAdmin = () => {
  const [activeTab, setActiveTab] = React.useState('dashboard');
  const [users, setUsers] = React.useState<any[]>([]);
  const [stats, setStats] = React.useState<any>({});
  const [logs, setLogs] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [showCreateUserModal, setShowCreateUserModal] = React.useState(false);
  const [createUserForm, setCreateUserForm] = React.useState({
    username: '',
    email: '',
    password: '',
    role: 'user'
  });
  const [searchTerm, setSearchTerm] = React.useState('');
  const [selectedRole, setSelectedRole] = React.useState('all');
  const [currentPage, setCurrentPage] = React.useState(1);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '20'
      });

      if (searchTerm) {
        params.append('search', searchTerm);
      }

      if (selectedRole !== 'all') {
        params.append('role', selectedRole);
      }

      const response = await fetch(`http://localhost:4000/api/admin/users?${params}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        setUsers(data.users || []);
      }
    } catch (error) {
      console.error('Failed to fetch users:', error);
    }
  };

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:4000/api/admin/stats', {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        setStats(data.stats || {});
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  const fetchLogs = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:4000/api/admin/logs', {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        setLogs(data.logs || []);
      }
    } catch (error) {
      console.error('Failed to fetch logs:', error);
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:4000/api/admin/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(createUserForm)
      });

      if (response.ok) {
        setShowCreateUserModal(false);
        setCreateUserForm({
          username: '',
          email: '',
          password: '',
          role: 'user'
        });
        fetchUsers();
        fetchStats();
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to create user');
      }
    } catch (error) {
      console.error('Failed to create user:', error);
      alert('Failed to create user');
    }
  };

  const handleUpdateRole = async (userId: number, newRole: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:4000/api/admin/users/${userId}/role`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ role: newRole })
      });

      if (response.ok) {
        fetchUsers();
        fetchStats();
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to update user role');
      }
    } catch (error) {
      console.error('Failed to update user role:', error);
    }
  };

  const handleDeleteUser = async (userId: number) => {
    if (!window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:4000/api/admin/users/${userId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.ok) {
        fetchUsers();
        fetchStats();
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to delete user');
      }
    } catch (error) {
      console.error('Failed to delete user:', error);
    }
  };

  React.useEffect(() => {
    fetchUsers();
    fetchStats();
    fetchLogs();
    setLoading(false);
  }, [currentPage, searchTerm, selectedRole]);

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="super-admin-container">
      <div className="super-admin-header">
        <h2 className="super-admin-title">
          <i className="bi bi-shield-lock me-2"></i>
          Super Admin Dashboard
        </h2>
        <p className="super-admin-subtitle">Complete system administration and user management</p>
      </div>

      <Tabs activeKey={activeTab} onSelect={(k) => setActiveTab(k || 'dashboard')} className="mb-4">
        <Tab eventKey="dashboard" title="Dashboard">
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">
                <i className="bi bi-people-fill"></i>
              </div>
              <div className="stat-content">
                <h3>{stats.totalUsers || 0}</h3>
                <p>Total Users</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">
                <i className="bi bi-shield-check"></i>
              </div>
              <div className="stat-content">
                <h3>{stats.adminUsers || 0}</h3>
                <p>Admin Users</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">
                <i className="bi bi-shield-lock"></i>
              </div>
              <div className="stat-content">
                <h3>{stats.superAdminUsers || 0}</h3>
                <p>Super Admins</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">
                <i className="bi bi-calendar-event"></i>
              </div>
              <div className="stat-content">
                <h3>{stats.totalEvents || 0}</h3>
                <p>Total Events</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">
                <i className="bi bi-geo-alt"></i>
              </div>
              <div className="stat-content">
                <h3>{stats.totalSkateSpots || 0}</h3>
                <p>Skate Spots</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">
                <i className="bi bi-images"></i>
              </div>
              <div className="stat-content">
                <h3>{stats.totalPhotos || 0}</h3>
                <p>Gallery Photos</p>
              </div>
            </div>
          </div>
        </Tab>

        <Tab eventKey="users" title="User Management">
          <div className="user-management">
            <div className="user-controls mb-4">
              <Row className="align-items-center">
                <Col md={4}>
                  <Form.Control
                    type="text"
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </Col>
                <Col md={3}>
                  <Form.Select
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value)}
                  >
                    <option value="all">All Roles</option>
                    <option value="user">Users</option>
                    <option value="admin">Admins</option>
                    <option value="super_admin">Super Admins</option>
                  </Form.Select>
                </Col>
                <Col md={3}>
                  <Button
                    variant="primary"
                    onClick={() => setShowCreateUserModal(true)}
                  >
                    <i className="bi bi-person-plus me-2"></i>
                    Create User
                  </Button>
                </Col>
              </Row>
            </div>

            <div className="users-table">
              <Table striped bordered hover responsive>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Username</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Verified</th>
                    <th>Created</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id}>
                      <td>{user.id}</td>
                      <td>{user.username}</td>
                      <td>{user.email}</td>
                      <td>
                        <Badge bg={
                          user.role === 'super_admin' ? 'danger' :
                            user.role === 'admin' ? 'warning' : 'secondary'
                        }>
                          {user.role}
                        </Badge>
                      </td>
                      <td>
                        <Badge bg={user.verified ? 'success' : 'danger'}>
                          {user.verified ? 'Yes' : 'No'}
                        </Badge>
                      </td>
                      <td>{new Date(user.created_at).toLocaleDateString()}</td>
                      <td>
                        <div className="user-actions">
                          <Dropdown>
                            <Dropdown.Toggle variant="outline-secondary" size="sm">
                              Role
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                              <Dropdown.Item onClick={() => handleUpdateRole(user.id, 'user')}>
                                User
                              </Dropdown.Item>
                              <Dropdown.Item onClick={() => handleUpdateRole(user.id, 'admin')}>
                                Admin
                              </Dropdown.Item>
                              <Dropdown.Item onClick={() => handleUpdateRole(user.id, 'super_admin')}>
                                Super Admin
                              </Dropdown.Item>
                            </Dropdown.Menu>
                          </Dropdown>
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => handleDeleteUser(user.id)}
                            className="ms-2"
                          >
                            <i className="bi bi-trash"></i>
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          </div>
        </Tab>

        <Tab eventKey="logs" title="System Logs">
          <div className="system-logs">
            <h4>Recent System Activity</h4>
            <div className="logs-list">
              {logs.map((log) => (
                <div key={log.id} className="log-item">
                  <div className="log-header">
                    <span className={`log-level log-level-${log.level.toLowerCase()}`}>
                      {log.level}
                    </span>
                    <span className="log-timestamp">
                      {new Date(log.timestamp).toLocaleString()}
                    </span>
                    <span className="log-user">{log.user}</span>
                  </div>
                  <div className="log-message">{log.message}</div>
                </div>
              ))}
            </div>
          </div>
        </Tab>
      </Tabs>

      {/* Create User Modal */}
      <Modal show={showCreateUserModal} onHide={() => setShowCreateUserModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Create New User</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleCreateUser}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                value={createUserForm.username}
                onChange={(e) => setCreateUserForm({ ...createUserForm, username: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                value={createUserForm.email}
                onChange={(e) => setCreateUserForm({ ...createUserForm, email: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                value={createUserForm.password}
                onChange={(e) => setCreateUserForm({ ...createUserForm, password: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Role</Form.Label>
              <Form.Select
                value={createUserForm.role}
                onChange={(e) => setCreateUserForm({ ...createUserForm, role: e.target.value })}
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
                <option value="super_admin">Super Admin</option>
              </Form.Select>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowCreateUserModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Create User
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
};

const Profile = () => {
  const { user, role } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    bio: '',
    location: '',
    website: '',
    socialMedia: {
      instagram: '',
      twitter: '',
      facebook: ''
    }
  });
  const [isEditing, setIsEditing] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    eventReminders: true,
    newMessages: true,
    marketingEmails: false
  });
  const [privacy, setPrivacy] = useState({
    profileVisibility: 'public',
    showEmail: false,
    showPhone: false,
    allowMessages: true,
    showOnlineStatus: true
  });

  const handleProfileSave = () => {
    // TODO: Save profile data to backend
    setIsEditing(false);
    // Show success message
  };

  const handlePasswordChange = () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('New passwords do not match!');
      return;
    }
    // TODO: Change password via backend
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    // Show success message
  };

  const handleDeleteAccount = () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      // TODO: Delete account via backend
      console.log('Account deletion requested');
    }
  };

  return (
    <div>
      <h2 className="mb-4">My Profile</h2>

      <Tabs activeKey={activeTab} onSelect={(k) => setActiveTab(k || 'profile')} className="mb-4">
        <Tab eventKey="profile" title="Profile Information">
          <div className="card">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Personal Information</h5>
              <Button
                variant={isEditing ? "success" : "primary"}
                size="sm"
                onClick={() => isEditing ? handleProfileSave() : setIsEditing(true)}
              >
                {isEditing ? "Save Changes" : "Edit Profile"}
              </Button>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-3 text-center mb-4">
                  <div
                    style={{
                      width: '120px',
                      height: '120px',
                      borderRadius: '50%',
                      backgroundColor: '#007bff',
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '2.5rem',
                      fontWeight: 'bold',
                      margin: '0 auto 1rem auto',
                      cursor: 'pointer'
                    }}
                    title="Click to change profile picture"
                  >
                    {user?.substring(0, 2).toUpperCase()}
                  </div>
                  <Button variant="outline-primary" size="sm" disabled>
                    Change Photo
                  </Button>
                </div>
                <div className="col-md-9">
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <Form.Label>First Name</Form.Label>
                      <Form.Control
                        type="text"
                        value={profileData.firstName}
                        onChange={(e) => setProfileData({ ...profileData, firstName: e.target.value })}
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <Form.Label>Last Name</Form.Label>
                      <Form.Control
                        type="text"
                        value={profileData.lastName}
                        onChange={(e) => setProfileData({ ...profileData, lastName: e.target.value })}
                        disabled={!isEditing}
                      />
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <Form.Label>Email</Form.Label>
                      <Form.Control
                        type="email"
                        value={profileData.email}
                        onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <Form.Label>Phone</Form.Label>
                      <Form.Control
                        type="tel"
                        value={profileData.phone}
                        onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                        disabled={!isEditing}
                      />
                    </div>
                  </div>
                  <div className="mb-3">
                    <Form.Label>Location</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="City, State"
                      value={profileData.location}
                      onChange={(e) => setProfileData({ ...profileData, location: e.target.value })}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="mb-3">
                    <Form.Label>Website</Form.Label>
                    <Form.Control
                      type="url"
                      placeholder="https://yourwebsite.com"
                      value={profileData.website}
                      onChange={(e) => setProfileData({ ...profileData, website: e.target.value })}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="mb-3">
                    <Form.Label>Bio</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      placeholder="Tell us about yourself..."
                      value={profileData.bio}
                      onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                      disabled={!isEditing}
                    />
                  </div>

                  <h6 className="mt-4 mb-3">Social Media</h6>
                  <div className="row">
                    <div className="col-md-4 mb-3">
                      <Form.Label><i className="bi bi-instagram"></i> Instagram</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="@username"
                        value={profileData.socialMedia.instagram}
                        onChange={(e) => setProfileData({
                          ...profileData,
                          socialMedia: { ...profileData.socialMedia, instagram: e.target.value }
                        })}
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="col-md-4 mb-3">
                      <Form.Label><i className="bi bi-twitter"></i> Twitter</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="@username"
                        value={profileData.socialMedia.twitter}
                        onChange={(e) => setProfileData({
                          ...profileData,
                          socialMedia: { ...profileData.socialMedia, twitter: e.target.value }
                        })}
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="col-md-4 mb-3">
                      <Form.Label><i className="bi bi-facebook"></i> Facebook</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="facebook.com/username"
                        value={profileData.socialMedia.facebook}
                        onChange={(e) => setProfileData({
                          ...profileData,
                          socialMedia: { ...profileData.socialMedia, facebook: e.target.value }
                        })}
                        disabled={!isEditing}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Tab>

        <Tab eventKey="security" title="Security">
          <div className="card">
            <div className="card-header">
              <h5 className="mb-0">Change Password</h5>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-6">
                  <Form.Group className="mb-3">
                    <Form.Label>Current Password</Form.Label>
                    <Form.Control
                      type="password"
                      value={passwordData.currentPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>New Password</Form.Label>
                    <Form.Control
                      type="password"
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Confirm New Password</Form.Label>
                    <Form.Control
                      type="password"
                      value={passwordData.confirmPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                    />
                  </Form.Group>
                  <Button variant="primary" onClick={handlePasswordChange}>
                    Change Password
                  </Button>
                </div>
                <div className="col-md-6">
                  <div className="card bg-light">
                    <div className="card-body">
                      <h6>Password Requirements</h6>
                      <ul className="mb-0">
                        <li>At least 8 characters long</li>
                        <li>Contains uppercase and lowercase letters</li>
                        <li>Contains at least one number</li>
                        <li>Contains at least one special character</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Tab>

        <Tab eventKey="notifications" title="Notifications">
          <div className="card">
            <div className="card-header">
              <h5 className="mb-0">Notification Preferences</h5>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-6">
                  <h6>Email Notifications</h6>
                  <Form.Check
                    type="switch"
                    id="email-notifications"
                    label="Email notifications"
                    checked={notifications.emailNotifications}
                    onChange={(e) => setNotifications({ ...notifications, emailNotifications: e.target.checked })}
                  />
                  <Form.Check
                    type="switch"
                    id="event-reminders"
                    label="Event reminders"
                    checked={notifications.eventReminders}
                    onChange={(e) => setNotifications({ ...notifications, eventReminders: e.target.checked })}
                  />
                  <Form.Check
                    type="switch"
                    id="new-messages"
                    label="New messages"
                    checked={notifications.newMessages}
                    onChange={(e) => setNotifications({ ...notifications, newMessages: e.target.checked })}
                  />
                  <Form.Check
                    type="switch"
                    id="marketing-emails"
                    label="Marketing emails"
                    checked={notifications.marketingEmails}
                    onChange={(e) => setNotifications({ ...notifications, marketingEmails: e.target.checked })}
                  />
                </div>
                <div className="col-md-6">
                  <h6>Push Notifications</h6>
                  <Form.Check
                    type="switch"
                    id="push-notifications"
                    label="Enable push notifications"
                    defaultChecked
                  />
                  <Form.Check
                    type="switch"
                    id="sound-notifications"
                    label="Sound notifications"
                    defaultChecked
                  />
                </div>
              </div>
            </div>
          </div>
        </Tab>

        <Tab eventKey="privacy" title="Privacy">
          <div className="card">
            <div className="card-header">
              <h5 className="mb-0">Privacy Settings</h5>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-6">
                  <Form.Group className="mb-3">
                    <Form.Label>Profile Visibility</Form.Label>
                    <Form.Select
                      value={privacy.profileVisibility}
                      onChange={(e) => setPrivacy({ ...privacy, profileVisibility: e.target.value })}
                    >
                      <option value="public">Public</option>
                      <option value="friends">Friends Only</option>
                      <option value="private">Private</option>
                    </Form.Select>
                  </Form.Group>
                  <Form.Check
                    type="switch"
                    id="show-email"
                    label="Show email to other users"
                    checked={privacy.showEmail}
                    onChange={(e) => setPrivacy({ ...privacy, showEmail: e.target.checked })}
                  />
                  <Form.Check
                    type="switch"
                    id="show-phone"
                    label="Show phone to other users"
                    checked={privacy.showPhone}
                    onChange={(e) => setPrivacy({ ...privacy, showPhone: e.target.checked })}
                  />
                  <Form.Check
                    type="switch"
                    id="allow-messages"
                    label="Allow messages from other users"
                    checked={privacy.allowMessages}
                    onChange={(e) => setPrivacy({ ...privacy, allowMessages: e.target.checked })}
                  />
                  <Form.Check
                    type="switch"
                    id="show-online-status"
                    label="Show my online status to other users"
                    checked={privacy.showOnlineStatus}
                    onChange={(e) => setPrivacy({ ...privacy, showOnlineStatus: e.target.checked })}
                  />
                </div>
                <div className="col-md-6">
                  <div className="card bg-light">
                    <div className="card-body">
                      <h6>Privacy Tips</h6>
                      <ul className="mb-0">
                        <li>Public profiles are visible to everyone</li>
                        <li>Friends only restricts visibility to your connections</li>
                        <li>Private profiles are only visible to you</li>
                        <li>Online status shows when you were last active</li>
                        <li>You can change these settings anytime</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Tab>

        <Tab eventKey="danger" title="Danger Zone">
          <div className="card border-danger">
            <div className="card-header bg-danger text-white">
              <h5 className="mb-0">Danger Zone</h5>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-8">
                  <h6>Delete Account</h6>
                  <p className="text-muted">
                    Once you delete your account, there is no going back. Please be certain.
                  </p>
                  <Button variant="danger" onClick={handleDeleteAccount}>
                    Delete My Account
                  </Button>
                </div>
                <div className="col-md-4">
                  <div className="card bg-light">
                    <div className="card-body">
                      <h6>What happens when you delete your account?</h6>
                      <ul className="mb-0">
                        <li>All your data will be permanently deleted</li>
                        <li>You won't be able to recover your account</li>
                        <li>Your profile will be removed from the platform</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Tab>
      </Tabs>
    </div>
  );
};

const Settings = ({ darkMode, setDarkMode }: { darkMode: boolean; setDarkMode: (mode: boolean) => void }) => {
  return (
    <div className="settings-container">
      <h2><i className="bi bi-gear me-2"></i>Settings</h2>

      <div className="row">
        <div className="col-md-6">
          <div className="card">
            <div className="card-header">
              <h5><i className="bi bi-palette me-2"></i>Appearance</h5>
            </div>
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6>Dark Mode</h6>
                  <p className="text-muted mb-0">Switch between light and dark themes</p>
                </div>
                <div className="form-check form-switch">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="darkModeToggle"
                    checked={darkMode}
                    onChange={(e) => setDarkMode(e.target.checked)}
                  />
                  <label className="form-check-label" htmlFor="darkModeToggle">
                    {darkMode ? 'On' : 'Off'}
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card">
            <div className="card-header">
              <h5><i className="bi bi-bell me-2"></i>Notifications</h5>
            </div>
            <div className="card-body">
              <div className="mb-3">
                <div className="form-check form-switch">
                  <input className="form-check-input" type="checkbox" id="emailNotifications" defaultChecked />
                  <label className="form-check-label" htmlFor="emailNotifications">
                    Email Notifications
                  </label>
                </div>
              </div>
              <div className="mb-3">
                <div className="form-check form-switch">
                  <input className="form-check-input" type="checkbox" id="pushNotifications" defaultChecked />
                  <label className="form-check-label" htmlFor="pushNotifications">
                    Push Notifications
                  </label>
                </div>
              </div>
              <div className="mb-3">
                <div className="form-check form-switch">
                  <input className="form-check-input" type="checkbox" id="eventReminders" defaultChecked />
                  <label className="form-check-label" htmlFor="eventReminders">
                    Event Reminders
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row mt-4">
        <div className="col-md-6">
          <div className="card">
            <div className="card-header">
              <h5><i className="bi bi-shield me-2"></i>Privacy</h5>
            </div>
            <div className="card-body">
              <div className="mb-3">
                <div className="form-check form-switch">
                  <input className="form-check-input" type="checkbox" id="profileVisibility" defaultChecked />
                  <label className="form-check-label" htmlFor="profileVisibility">
                    Public Profile
                  </label>
                </div>
              </div>
              <div className="mb-3">
                <div className="form-check form-switch">
                  <input className="form-check-input" type="checkbox" id="lastActiveVisibility" defaultChecked />
                  <label className="form-check-label" htmlFor="lastActiveVisibility">
                    Show Last Active
                  </label>
                </div>
              </div>
              <div className="mb-3">
                <div className="form-check form-switch">
                  <input className="form-check-input" type="checkbox" id="locationSharing" />
                  <label className="form-check-label" htmlFor="locationSharing">
                    Share Location
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card">
            <div className="card-header">
              <h5><i className="bi bi-geo-alt me-2"></i>Map Settings</h5>
            </div>
            <div className="card-body">
              <div className="mb-3">
                <label className="form-label">Default Map Zoom</label>
                <select className="form-select">
                  <option value="10">City Level (10)</option>
                  <option value="12" selected>Neighborhood Level (12)</option>
                  <option value="14">Street Level (14)</option>
                  <option value="16">Detailed Level (16)</option>
                </select>
              </div>
              <div className="mb-3">
                <div className="form-check form-switch">
                  <input className="form-check-input" type="checkbox" id="autoLocation" defaultChecked />
                  <label className="form-check-label" htmlFor="autoLocation">
                    Auto-detect Location
                  </label>
                </div>
              </div>
              <div className="mb-3">
                <div className="form-check form-switch">
                  <input className="form-check-input" type="checkbox" id="showWeather" defaultChecked />
                  <label className="form-check-label" htmlFor="showWeather">
                    Show Weather Data
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Messages = () => {
  const { user: currentUser } = useAuth();
  const [messages, setMessages] = React.useState<any[]>([]);
  const [conversations, setConversations] = React.useState<any[]>([]);
  const [selectedConversation, setSelectedConversation] = React.useState<any>(null);
  const [newMessage, setNewMessage] = React.useState('');
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:4000/api/messages', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setMessages(data.messages);

        // Group messages by conversation
        const conversationMap = new Map();
        data.messages.forEach((msg: any) => {
          const otherUser = msg.senderId === currentUser ? msg.receiverName : msg.senderName;
          const otherUserId = msg.senderId === currentUser ? msg.receiverId : msg.senderId;

          if (!conversationMap.has(otherUserId)) {
            conversationMap.set(otherUserId, {
              userId: otherUserId,
              username: otherUser,
              lastMessage: msg.message,
              timestamp: msg.timestamp,
              unread: msg.receiverId === currentUser && !msg.read
            });
          } else {
            const conv = conversationMap.get(otherUserId);
            if (new Date(msg.timestamp) > new Date(conv.timestamp)) {
              conv.lastMessage = msg.message;
              conv.timestamp = msg.timestamp;
              conv.unread = msg.receiverId === currentUser && !msg.read;
            }
          }
        });

        setConversations(Array.from(conversationMap.values()));
      }
    } catch (error) {
      console.error('Failed to fetch messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchConversation = async (userId: number) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:4000/api/messages/${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setSelectedConversation({
          userId,
          messages: data.messages
        });
      }
    } catch (error) {
      console.error('Failed to fetch conversation:', error);
    }
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() && selectedConversation) {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:4000/api/messages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            receiverId: selectedConversation.userId,
            message: newMessage.trim()
          })
        });

        if (response.ok) {
          setNewMessage('');
          fetchConversation(selectedConversation.userId);
          fetchMessages(); // Refresh conversation list
        }
      } catch (error) {
        console.error('Failed to send message:', error);
      }
    }
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  if (loading) {
    return (
      <div className="text-center p-4">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="mb-4">Messages</h2>
      <div className="row">
        <div className="col-md-4">
          <div className="card">
            <div className="card-header">
              <h5 className="mb-0">Conversations</h5>
            </div>
            <div className="list-group list-group-flush" style={{ maxHeight: '60vh', overflowY: 'auto' }}>
              {conversations.length === 0 ? (
                <div className="list-group-item text-center text-muted">
                  No conversations yet
                </div>
              ) : (
                conversations.map((conv) => (
                  <div
                    key={conv.userId}
                    className={`list-group-item list-group-item-action ${selectedConversation?.userId === conv.userId ? 'active' : ''}`}
                    onClick={() => fetchConversation(conv.userId)}
                    style={{ cursor: 'pointer' }}
                  >
                    <div className="d-flex justify-content-between align-items-start">
                      <div>
                        <h6 className="mb-1">{conv.username}</h6>
                        <small className={selectedConversation?.userId === conv.userId ? 'text-light' : 'text-muted'}>
                          {conv.lastMessage.length > 50 ? `${conv.lastMessage.substring(0, 50)}...` : conv.lastMessage}
                        </small>
                      </div>
                      <div className="text-end">
                        <small className={selectedConversation?.userId === conv.userId ? 'text-light' : 'text-muted'}>
                          {formatTime(conv.timestamp)}
                        </small>
                        {conv.unread && (
                          <div className="badge bg-danger ms-2">New</div>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="col-md-8">
          {selectedConversation ? (
            <div className="card">
              <div className="card-header">
                <h5 className="mb-0">Conversation with {selectedConversation.messages[0]?.senderName || selectedConversation.messages[0]?.receiverName}</h5>
              </div>
              <div className="card-body" style={{ height: '400px', overflowY: 'auto' }}>
                {selectedConversation.messages.map((msg: any) => (
                  <div
                    key={msg.id}
                    className={`mb-3 ${msg.senderId === currentUser ? 'text-end' : 'text-start'}`}
                  >
                    <div
                      className={`d-inline-block p-3 rounded ${msg.senderId === currentUser
                        ? 'bg-primary text-white'
                        : 'bg-light text-dark'
                        }`}
                      style={{ maxWidth: '70%' }}
                    >
                      <div>{msg.message}</div>
                      <small className={msg.senderId === currentUser ? 'text-light' : 'text-muted'}>
                        {formatTime(msg.timestamp)}
                      </small>
                    </div>
                  </div>
                ))}
              </div>
              <div className="card-footer">
                <Form onSubmit={sendMessage}>
                  <div className="input-group">
                    <Form.Control
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type your message..."
                    />
                    <Button type="submit" variant="primary">
                      Send
                    </Button>
                  </div>
                </Form>
              </div>
            </div>
          ) : (
            <div className="card">
              <div className="card-body text-center text-muted">
                <i className="bi bi-chat-dots" style={{ fontSize: '3rem' }}></i>
                <h5 className="mt-3">Select a conversation</h5>
                <p>Choose a conversation from the list to start messaging</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
const gf = new GiphyFetch('dc6zaTOxFJmzC'); // public beta key for demo

const Chat = () => {
  const [messages, setMessages] = React.useState<any[]>([]);
  const [input, setInput] = React.useState('');
  const [showEmoji, setShowEmoji] = React.useState(false);
  const [showGif, setShowGif] = React.useState(false);
  const [gifResults, setGifResults] = React.useState<any[]>([]);
  const [gifSearch, setGifSearch] = React.useState('');
  const [image, setImage] = React.useState<string | null>(null);

  // Like a message
  const handleLike = (idx: number) => {
    setMessages(msgs => msgs.map((m, i) => i === idx ? { ...m, likes: (m.likes || 0) + 1 } : m));
  };

  // Add emoji to input
  const addEmoji = (emojiData: any) => {
    setInput(input + emojiData.emoji);
    setShowEmoji(false);
  };

  // Handle image upload
  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = ev => setImage(ev.target?.result as string);
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  // Handle GIF search
  const handleGifSearch = async (q: string) => {
    setGifSearch(q);
    if (q.trim()) {
      const { data } = await gf.search(q, { limit: 8 });
      setGifResults(data);
    } else {
      setGifResults([]);
    }
  };

  // Send message
  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() || image) {
      setMessages([
        ...messages,
        {
          text: input,
          image,
          gif: null,
          likes: 0,
          emojis: [],
        },
      ]);
      setInput('');
      setImage(null);
    }
  };

  // Send GIF
  const handleSendGif = (gifUrl: string) => {
    setMessages([
      ...messages,
      {
        text: '',
        image: null,
        gif: gifUrl,
        likes: 0,
        emojis: [],
      },
    ]);
    setShowGif(false);
    setGifSearch('');
    setGifResults([]);
  };

  return (
    <div>
      <h2>Chat Room</h2>
      <div style={{ maxHeight: 350, overflowY: 'auto', marginBottom: 16, background: '#f8f9fa', borderRadius: 8, padding: 8 }}>
        {messages.map((msg, idx) => (
          <div key={idx} style={{ marginBottom: 12, display: 'flex', alignItems: 'center' }}>
            <div style={{ flex: 1 }}>
              {msg.text && <span style={{ marginRight: 8 }}>{msg.text}</span>}
              {msg.image && <img src={msg.image} alt="chat-img" style={{ maxWidth: 120, maxHeight: 120, borderRadius: 8, marginRight: 8 }} />}
              {msg.gif && <img src={msg.gif} alt="gif" style={{ maxWidth: 120, maxHeight: 120, borderRadius: 8, marginRight: 8 }} />}
            </div>
            <Button size="sm" variant={msg.likes > 0 ? 'success' : 'outline-success'} onClick={() => handleLike(idx)} style={{ marginRight: 8 }}>
              👍 {msg.likes || 0}
            </Button>
          </div>
        ))}
      </div>
      <Form onSubmit={handleSend} className="mb-2">
        <Row className="align-items-center">
          <Col xs={12} md={7} className="mb-2 mb-md-0">
            <Form.Control
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Type a message..."
              autoFocus
            />
          </Col>
          <Col xs="auto">
            <Button variant="outline-secondary" type="button" onClick={() => setShowEmoji(v => !v)} title="Add emoji">😊</Button>
          </Col>
          <Col xs="auto">
            <Form.Label htmlFor="chat-img-upload" className="btn btn-outline-secondary mb-0" title="Send image">📷</Form.Label>
            <Form.Control id="chat-img-upload" type="file" accept="image/*" style={{ display: 'none' }} onChange={handleImage} />
          </Col>
          <Col xs="auto">
            <Button variant="outline-info" type="button" onClick={() => setShowGif(v => !v)} title="Send GIF">GIF</Button>
          </Col>
          <Col xs="auto">
            <Button type="submit" variant="primary">Send</Button>
          </Col>
        </Row>
      </Form>
      {image && (
        <div className="mb-2"><img src={image} alt="preview" style={{ maxWidth: 120, maxHeight: 120, borderRadius: 8 }} /></div>
      )}
      {showEmoji && (
        <div style={{ position: 'absolute', zIndex: 10 }}>
          <EmojiPicker onEmojiClick={addEmoji} />
        </div>
      )}
      {showGif && (
        <div style={{ position: 'absolute', zIndex: 10, background: '#fff', borderRadius: 8, padding: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}>
          <Form.Control
            type="text"
            value={gifSearch}
            onChange={e => handleGifSearch(e.target.value)}
            placeholder="Search GIFs..."
            className="mb-2"
            autoFocus
          />
          <div style={{ maxHeight: 200, overflowY: 'auto', minWidth: 300 }}>
            {gifResults.map((gif: any) => (
              <img
                key={gif.id}
                src={gif.images.fixed_height_small.url}
                alt={gif.title}
                style={{ cursor: 'pointer', margin: 4, borderRadius: 8 }}
                onClick={() => handleSendGif(gif.images.fixed_height.url)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
const demoUsers = [
  {
    id: 1,
    name: 'Alice Johnson',
    username: 'alice_j',
    email: 'alice@example.com',
    bio: 'Passionate roller skater and Tampa Bay local. Love hitting the trails and meeting new people in the skating community! 🛼',
    location: 'Tampa, FL',
    role: 'user',
    joinedDate: '2024-01-15',
    lastActive: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
    showOnlineStatus: true,
    liked: false,
    connected: false,
    socialMedia: {
      instagram: '@alice_skates',
      twitter: '@alice_j',
      facebook: ''
    },
    skills: ['Speed Skating', 'Trail Skating', 'Teaching'],
    eventsAttended: 12
  },
  {
    id: 2,
    name: 'Bob Martinez',
    username: 'bob_m',
    email: 'bob@example.com',
    bio: 'Skateboarder turned roller skater. Always looking for new challenges and cool spots to skate around Tampa! 🛹➡️🛼',
    location: 'St. Petersburg, FL',
    role: 'user',
    joinedDate: '2023-11-20',
    lastActive: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
    showOnlineStatus: true,
    liked: false,
    connected: false,
    socialMedia: {
      instagram: '@bob_skates',
      twitter: '',
      facebook: 'bob.martinez'
    },
    skills: ['Aggressive Skating', 'Park Skating', 'Tricks'],
    eventsAttended: 8
  },
  {
    id: 3,
    name: 'Charlie Chen',
    username: 'charlie_c',
    email: 'charlie@example.com',
    bio: 'Dance skater and choreographer. Love creating routines and helping others discover the joy of dance skating! 💃🛼',
    location: 'Clearwater, FL',
    role: 'admin',
    joinedDate: '2023-08-10',
    lastActive: new Date(Date.now() - 2 * 60 * 1000), // 2 minutes ago
    showOnlineStatus: true,
    liked: false,
    connected: false,
    socialMedia: {
      instagram: '@charlie_danceskates',
      twitter: '@charlie_c',
      facebook: 'charlie.chen'
    },
    skills: ['Dance Skating', 'Choreography', 'Teaching', 'Event Planning'],
    eventsAttended: 25
  },
  {
    id: 4,
    name: 'Diana Rodriguez',
    username: 'diana_r',
    email: 'diana@example.com',
    bio: 'Quad skater and vintage enthusiast. Love the classic skating style and collecting retro skating gear! 🎭🛼',
    location: 'Tampa, FL',
    role: 'user',
    joinedDate: '2024-02-05',
    lastActive: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    showOnlineStatus: false, // This user has disabled online status
    liked: false,
    connected: false,
    socialMedia: {
      instagram: '@diana_quads',
      twitter: '',
      facebook: ''
    },
    skills: ['Quad Skating', 'Vintage Style', 'Photography'],
    eventsAttended: 5
  },
  {
    id: 5,
    name: 'Ethan Williams',
    username: 'ethan_w',
    email: 'ethan@example.com',
    bio: 'Speed skater and fitness enthusiast. Training for competitions and always pushing my limits! 🏃‍♂️🛼',
    location: 'Largo, FL',
    role: 'user',
    joinedDate: '2023-12-01',
    lastActive: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
    showOnlineStatus: true,
    liked: false,
    connected: false,
    socialMedia: {
      instagram: '@ethan_speed',
      twitter: '@ethan_w',
      facebook: 'ethan.williams'
    },
    skills: ['Speed Skating', 'Endurance Training', 'Competition'],
    eventsAttended: 18
  }
];

const Profiles = () => {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = React.useState(demoUsers);
  const [selectedUser, setSelectedUser] = React.useState<any>(null);
  const [showMessageModal, setShowMessageModal] = React.useState(false);
  const [messageTo, setMessageTo] = React.useState<string | null>(null);
  const [message, setMessage] = React.useState('');
  const [searchTerm, setSearchTerm] = React.useState('');
  const [filterRole, setFilterRole] = React.useState('all');
  const [filterStatus, setFilterStatus] = React.useState('all');
  const [sortBy, setSortBy] = React.useState('name');

  // Handle escape key to close modal
  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && showMessageModal) {
        setShowMessageModal(false);
        setMessageTo(null);
        setMessage('');
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [showMessageModal]);

  const handleLike = (id: number) => {
    setUsers(users.map(u => u.id === id ? { ...u, liked: !u.liked } : u));
  };

  const handleConnect = (id: number) => {
    setUsers(users.map(u => u.id === id ? { ...u, connected: !u.connected } : u));
  };

  const handleMessage = (user: any) => {
    setMessageTo(user.name);
    setMessage('');
    setShowMessageModal(true);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          alert('Please log in to send messages.');
          setShowMessageModal(false);
          return;
        }

        const response = await fetch('http://localhost:4000/api/messages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            receiverId: selectedUser?.id,
            message: message.trim()
          })
        });

        if (response.ok) {
          const data = await response.json();
          alert(`Message sent to ${messageTo}!`);
          setShowMessageModal(false);
          setMessageTo(null);
          setMessage('');
        } else {
          const data = await response.json();
          alert(`Error: ${data.error || 'Failed to send message'}`);
        }
      } catch (error) {
        console.error('Message error:', error);
        alert('Network error. Please check if the backend server is running.');
        setShowMessageModal(false);
      }
    }
  };

  const handleViewProfile = (user: any) => {
    setSelectedUser(user);
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatLastActive = (lastActive: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - lastActive.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) {
      return 'Just now';
    } else if (diffInMinutes < 60) {
      return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
    } else if (diffInMinutes < 1440) { // Less than 24 hours
      const hours = Math.floor(diffInMinutes / 60);
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else {
      const days = Math.floor(diffInMinutes / 1440);
      return `${days} day${days > 1 ? 's' : ''} ago`;
    }
  };

  const isOnline = (lastActive: Date) => {
    const diffInMinutes = Math.floor((new Date().getTime() - lastActive.getTime()) / (1000 * 60));
    return diffInMinutes < 5; // Online if active within last 5 minutes
  };

  // Filter and sort users
  const filteredUsers = users
    .filter(user => {
      const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.bio.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRole = filterRole === 'all' || user.role === filterRole;
      const matchesStatus = filterStatus === 'all' ||
        (filterStatus === 'online' && user.showOnlineStatus && isOnline(user.lastActive)) ||
        (filterStatus === 'offline' && (!user.showOnlineStatus || !isOnline(user.lastActive)));
      return matchesSearch && matchesRole && matchesStatus;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'joined':
          return new Date(b.joinedDate).getTime() - new Date(a.joinedDate).getTime();
        case 'events':
          return b.eventsAttended - a.eventsAttended;
        default:
          return 0;
      }
    });

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Members Directory</h2>
        <div className="d-flex gap-2">
          <Form.Control
            type="text"
            placeholder="Search members..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: '250px' }}
          />
          <Form.Select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            style={{ width: '150px' }}
          >
            <option value="all">All Roles</option>
            <option value="user">Users</option>
            <option value="admin">Admins</option>
          </Form.Select>
          <Form.Select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            style={{ width: '150px' }}
          >
            <option value="all">All Status</option>
            <option value="online">Online</option>
            <option value="offline">Offline</option>
          </Form.Select>
          <Form.Select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            style={{ width: '150px' }}
          >
            <option value="name">Sort by Name</option>
            <option value="joined">Sort by Joined</option>
            <option value="events">Sort by Events</option>
          </Form.Select>
        </div>
      </div>

      <div className="row">
        <div className="col-md-8">
          <div className="members-list">
            {filteredUsers.map(user => (
              <div key={user.id} className="member-card card mb-3">
                <div className="card-body">
                  <div className="row">
                    <div className="col-md-2 text-center">
                      <div className="position-relative">
                        <div
                          className="member-avatar"
                          style={{
                            width: '80px',
                            height: '80px',
                            borderRadius: '50%',
                            backgroundColor: user.role === 'admin' ? '#dc3545' : '#007bff',
                            color: 'white',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '1.5rem',
                            fontWeight: 'bold',
                            margin: '0 auto 0.5rem auto',
                            cursor: 'pointer'
                          }}
                          onClick={() => handleViewProfile(user)}
                          title="Click to view full profile"
                        >
                          {getInitials(user.name)}
                        </div>
                        {/* Online Status Indicator */}
                        {user.showOnlineStatus && isOnline(user.lastActive) && (
                          <div
                            className="online-indicator"
                            style={{
                              position: 'absolute',
                              bottom: '0.5rem',
                              right: '0.5rem',
                              width: '16px',
                              height: '16px',
                              backgroundColor: '#28a745',
                              border: '2px solid white',
                              borderRadius: '50%',
                              boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                            }}
                            title="Online now"
                          ></div>
                        )}
                      </div>
                      <div className="mb-2">
                        {user.role === 'admin' && (
                          <span className="badge bg-danger me-1">Admin</span>
                        )}
                        {user.showOnlineStatus && (
                          <span
                            className={`badge ${isOnline(user.lastActive) ? 'bg-success' : 'bg-secondary'}`}
                            title={isOnline(user.lastActive) ? 'Online' : `Last active ${formatLastActive(user.lastActive)}`}
                          >
                            {isOnline(user.lastActive) ? 'Online' : 'Offline'}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="col-md-7">
                      <div className="d-flex justify-content-between align-items-start">
                        <div>
                          <h5 className="mb-1">{user.name}</h5>
                          <p className="text-muted mb-1">@{user.username}</p>
                          <p className="mb-2">
                            <i className="bi bi-geo-alt"></i> {user.location}
                          </p>
                          <p className="mb-2" style={{ fontSize: '0.9rem' }}>
                            {user.bio.length > 100 ? `${user.bio.substring(0, 100)}...` : user.bio}
                          </p>
                          <div className="mb-2">
                            {user.skills.slice(0, 3).map((skill, index) => (
                              <span key={index} className="badge bg-light text-dark me-1">
                                {skill}
                              </span>
                            ))}
                            {user.skills.length > 3 && (
                              <span className="badge bg-secondary">+{user.skills.length - 3} more</span>
                            )}
                          </div>
                          <small className="text-muted">
                            <i className="bi bi-calendar-event"></i> Joined {formatDate(user.joinedDate)} •
                            <i className="bi bi-people"></i> {user.eventsAttended} events attended
                            {user.showOnlineStatus && (
                              <>
                                <br />
                                <i className="bi bi-clock"></i> Last active {formatLastActive(user.lastActive)}
                              </>
                            )}
                          </small>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-3 text-end">
                      <div className="d-flex flex-column gap-2">
                        <Button
                          variant={user.liked ? 'success' : 'outline-success'}
                          size="sm"
                          onClick={() => handleLike(user.id)}
                        >
                          <i className="bi bi-heart"></i> {user.liked ? 'Liked' : 'Like'}
                        </Button>
                        <Button
                          variant={user.connected ? 'primary' : 'outline-primary'}
                          size="sm"
                          onClick={() => handleConnect(user.id)}
                        >
                          <i className="bi bi-person-plus"></i> {user.connected ? 'Connected' : 'Connect'}
                        </Button>
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => handleMessage(user)}
                        >
                          <i className="bi bi-chat"></i> Message
                        </Button>
                        <Button
                          variant="outline-info"
                          size="sm"
                          onClick={() => handleViewProfile(user)}
                        >
                          <i className="bi bi-eye"></i> View Profile
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="col-md-4">
          <div className="sticky-top" style={{ top: '20px' }}>
            <div className="card">
              <div className="card-header">
                <h5 className="mb-0">Member Statistics</h5>
              </div>
              <div className="card-body">
                <div className="row text-center">
                  <div className="col-6">
                    <h4>{users.length}</h4>
                    <small className="text-muted">Total Members</small>
                  </div>
                  <div className="col-6">
                    <h4>{users.filter(u => u.role === 'admin').length}</h4>
                    <small className="text-muted">Admins</small>
                  </div>
                </div>
                <hr />
                <div className="row text-center">
                  <div className="col-6">
                    <h4>{users.filter(u => u.connected).length}</h4>
                    <small className="text-muted">Connected</small>
                  </div>
                  <div className="col-6">
                    <h4>{users.filter(u => u.liked).length}</h4>
                    <small className="text-muted">Liked</small>
                  </div>
                </div>
                <hr />
                <div className="row text-center">
                  <div className="col-6">
                    <h4>{users.filter(u => u.showOnlineStatus && isOnline(u.lastActive)).length}</h4>
                    <small className="text-muted">Online Now</small>
                  </div>
                  <div className="col-6">
                    <h4>{users.filter(u => u.showOnlineStatus).length}</h4>
                    <small className="text-muted">Show Status</small>
                  </div>
                </div>
              </div>
            </div>

            {selectedUser && (
              <div className="card mt-3">
                <div className="card-header">
                  <h5 className="mb-0">Profile Preview</h5>
                </div>
                <div className="card-body">
                  <div className="text-center mb-3">
                    <div
                      style={{
                        width: '100px',
                        height: '100px',
                        borderRadius: '50%',
                        backgroundColor: selectedUser.role === 'admin' ? '#dc3545' : '#007bff',
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '2rem',
                        fontWeight: 'bold',
                        margin: '0 auto'
                      }}
                    >
                      {getInitials(selectedUser.name)}
                    </div>
                    <h5 className="mt-2">{selectedUser.name}</h5>
                    <p className="text-muted">@{selectedUser.username}</p>
                  </div>
                  <p>{selectedUser.bio}</p>
                  <div className="mb-3">
                    <strong>Skills:</strong>
                    <div className="mt-1">
                      {selectedUser.skills.map((skill: string, index: number) => (
                        <span key={index} className="badge bg-primary me-1 mb-1">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="mb-3">
                    <strong>Social Media:</strong>
                    <div className="mt-1">
                      {selectedUser.socialMedia.instagram && (
                        <div><i className="bi bi-instagram"></i> {selectedUser.socialMedia.instagram}</div>
                      )}
                      {selectedUser.socialMedia.twitter && (
                        <div><i className="bi bi-twitter"></i> {selectedUser.socialMedia.twitter}</div>
                      )}
                      {selectedUser.socialMedia.facebook && (
                        <div><i className="bi bi-facebook"></i> {selectedUser.socialMedia.facebook}</div>
                      )}
                    </div>
                  </div>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => handleMessage(selectedUser)}
                    className="w-100"
                  >
                    <i className="bi bi-chat"></i> Send Message
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Message Modal */}
      {showMessageModal && (
        <div className="modal fade show" style={{ display: 'block' }} tabIndex={-1}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Send Message to {messageTo}</h5>
                <Button
                  type="button"
                  className="btn-close"
                  onClick={() => {
                    setShowMessageModal(false);
                    setMessageTo(null);
                    setMessage('');
                  }}
                ></Button>
              </div>
              <Form onSubmit={handleSendMessage}>
                <div className="modal-body">
                  <Form.Group>
                    <Form.Label>Message</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={4}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Type your private message..."
                      required
                      autoFocus
                    />
                  </Form.Group>
                </div>
                <div className="modal-footer">
                  <Button
                    variant="secondary"
                    onClick={() => {
                      setShowMessageModal(false);
                      setMessageTo(null);
                      setMessage('');
                    }}
                  >
                    Cancel
                  </Button>
                  <Button variant="primary" type="submit">
                    Send Message
                  </Button>
                </div>
              </Form>
            </div>
          </div>
          <div
            className="modal-backdrop fade show"
            onClick={() => {
              setShowMessageModal(false);
              setMessageTo(null);
              setMessage('');
            }}
            style={{ cursor: 'pointer' }}
          ></div>
        </div>
      )}
    </div>
  );
};
const Maps = () => {
  const [route, setRoute] = React.useState<[number, number][]>([]);
  const [savedRoutes, setSavedRoutes] = React.useState<[number, number][][]>([]);
  const [selectedFilter, setSelectedFilter] = React.useState<string>('all');
  const [showUserLocation, setShowUserLocation] = React.useState<boolean>(false);
  const [userLocation, setUserLocation] = React.useState<[number, number] | null>(null);
  const [mapCenter, setMapCenter] = React.useState<[number, number]>([27.9506, -82.4572]); // Tampa coordinates
  const [mapZoom, setMapZoom] = React.useState<number>(12);
  const [selectedSpot, setSelectedSpot] = React.useState<any>(null);
  const [showAddSpotModal, setShowAddSpotModal] = React.useState<boolean>(false);
  const [showEnhancedSpotModal, setShowEnhancedSpotModal] = React.useState<boolean>(false);
  const [enhancedSpotData, setEnhancedSpotData] = React.useState<any>(null);
  const [showReviewModal, setShowReviewModal] = React.useState<boolean>(false);
  const [showPhotoModal, setShowPhotoModal] = React.useState<boolean>(false);
  const [darkMode, setDarkMode] = React.useState<boolean>(false);
  const [showCitySearch, setShowCitySearch] = React.useState<boolean>(false);
  const [searchCity, setSearchCity] = React.useState<string>('');
  const [showAddressSearch, setShowAddressSearch] = React.useState<boolean>(false);
  const [searchAddress, setSearchAddress] = React.useState<string>('');
  const [isSearching, setIsSearching] = React.useState<boolean>(false);
  const [searchedLocation, setSearchedLocation] = React.useState<[number, number] | null>(null);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [searchResults, setSearchResults] = React.useState<any[]>([]);
  const [autocompletePredictions, setAutocompletePredictions] = React.useState<any[]>([]);
  const [showAutocomplete, setShowAutocomplete] = React.useState(false);
  const [autocompleteTimeout, setAutocompleteTimeout] = React.useState<NodeJS.Timeout | null>(null);
  const [mapBoundsTimeout, setMapBoundsTimeout] = React.useState<NodeJS.Timeout | null>(null);
  const [searchError, setSearchError] = React.useState('');
  const [mapBounds, setMapBounds] = React.useState<L.LatLngBounds | null>(null);
  const [visibleSpots, setVisibleSpots] = React.useState<any[]>([]);
  const [currentZoom, setCurrentZoom] = React.useState<number>(mapZoom);
  const [skateSpotsFromAPI, setSkateSpotsFromAPI] = React.useState<any[]>([]);
  const [loadingSpots, setLoadingSpots] = React.useState<boolean>(false);
  const [loadingApiSpots, setLoadingApiSpots] = React.useState<boolean>(false);
  const [apiSpots, setApiSpots] = React.useState<any[]>([]);
  const [spotCache, setSpotCache] = React.useState<Map<string, any[]>>(new Map());
  const [autoDiscovery, setAutoDiscovery] = React.useState<boolean>(true);
  const [weatherCache, setWeatherCache] = React.useState<Map<string, any>>(new Map());
  const [showWeatherFilter, setShowWeatherFilter] = React.useState<boolean>(false);
  const [newSpot, setNewSpot] = React.useState({
    name: '',
    type: 'park',
    difficulty: 'beginner',
    description: '',
    lat: 0,
    lng: 0
  });
  const { user } = useAuth();

  // Skate spots database - Multiple cities (memoized to prevent recreation)
  const skateSpots = React.useMemo(() => {
    const spotData: Array<{
      id: number;
      name: string;
      type: string;
      difficulty: string;
      coordinates: [number, number];
      description: string;
      features: string[];
      hours: string;
      rating: number;
      reviews: number;
      crowdLevel: string;
      photos: string[];
      city: string;
    }> = [
        // Tampa Area Spots
        {
          id: 1,
          name: "Tampa Skate Park",
          type: "park",
          difficulty: "intermediate",
          coordinates: [27.9506, -82.4572] as [number, number],
          description: "Popular skate park with ramps, bowls, and street obstacles",
          features: ["Lighting", "Water Fountain", "Restrooms", "Parking"],
          hours: "6 AM - 10 PM",
          rating: 4.5,
          reviews: 127,
          crowdLevel: "medium",
          photos: ["https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=400&q=80"],
          city: "Tampa"
        },
        {
          id: 2,
          name: "Bayshore Boulevard",
          type: "trail",
          difficulty: "beginner",
          coordinates: [27.9465, -82.4596] as [number, number],
          description: "Smooth waterfront trail perfect for cruising and beginners",
          features: ["Smooth Surface", "Waterfront Views", "Rest Areas", "Parking"],
          hours: "24/7",
          rating: 4.8,
          reviews: 89,
          crowdLevel: "high",
          photos: ["https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=400&q=80"],
          city: "Tampa"
        },
        {
          id: 3,
          name: "Curtis Hixon Waterfront Park",
          type: "park",
          difficulty: "beginner",
          coordinates: [27.9485, -82.4592] as [number, number],
          description: "Beautiful waterfront park with smooth surfaces for skating",
          features: ["Waterfront Views", "Smooth Surface", "Rest Areas", "Parking"],
          hours: "6 AM - 11 PM",
          rating: 4.3,
          reviews: 95,
          crowdLevel: "medium",
          photos: ["https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=400&q=80"],
          city: "Tampa"
        },
        {
          id: 4,
          name: "Riverwalk Trail",
          type: "trail",
          difficulty: "beginner",
          coordinates: [27.9475, -82.4585] as [number, number],
          description: "Scenic urban trail along the Hillsborough River",
          features: ["River Views", "Smooth Surface", "Restaurants", "Parking"],
          hours: "24/7",
          rating: 4.6,
          reviews: 156,
          crowdLevel: "medium",
          photos: ["https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=400&q=80"],
          city: "Tampa"
        },
        {
          id: 5,
          name: "Ybor City Skate Spot",
          type: "street",
          difficulty: "advanced",
          coordinates: [27.9659, -82.4494] as [number, number],
          description: "Historic district with great street skating spots",
          features: ["Historic", "Street Course", "Restaurants", "Parking"],
          hours: "24/7",
          rating: 4.2,
          reviews: 78,
          crowdLevel: "low",
          photos: ["https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=400&q=80"],
          city: "Tampa"
        },
        // St. Petersburg Area Spots
        {
          id: 6,
          name: "St. Pete Skate Park",
          type: "park",
          difficulty: "intermediate",
          coordinates: [27.7731, -82.6400] as [number, number],
          description: "Modern skate park with concrete bowls and street features",
          features: ["Concrete Bowls", "Street Course", "Lighting", "Parking"],
          hours: "6 AM - 10 PM",
          rating: 4.7,
          reviews: 203,
          crowdLevel: "high",
          photos: ["https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=400&q=80"],
          city: "St. Petersburg"
        },
        {
          id: 7,
          name: "Pinellas Trail",
          type: "trail",
          difficulty: "beginner",
          coordinates: [27.7701, -82.6364] as [number, number],
          description: "Long paved trail perfect for distance skating",
          features: ["Paved Surface", "Scenic Views", "Rest Areas", "Multiple Access Points"],
          hours: "24/7",
          rating: 4.9,
          reviews: 342,
          crowdLevel: "medium",
          photos: ["https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=400&q=80"],
          city: "St. Petersburg"
        },
        // Clearwater Area Spots
        {
          id: 8,
          name: "Clearwater Beach Boardwalk",
          type: "trail",
          difficulty: "beginner",
          coordinates: [27.9789, -82.8316] as [number, number],
          description: "Scenic beachfront boardwalk for casual skating",
          features: ["Beach Views", "Smooth Surface", "Restaurants", "Parking"],
          hours: "24/7",
          rating: 4.4,
          reviews: 167,
          crowdLevel: "high",
          photos: ["https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=400&q=80"],
          city: "Clearwater"
        },
        // Orlando Area Spots
        {
          id: 9,
          name: "Orlando Skate Park",
          type: "park",
          difficulty: "advanced",
          coordinates: [28.5383, -81.3792] as [number, number],
          description: "Professional-grade skate park with multiple skill levels",
          features: ["Multiple Bowls", "Street Course", "Pro Shop", "Parking"],
          hours: "6 AM - 10 PM",
          rating: 4.6,
          reviews: 189,
          crowdLevel: "medium",
          photos: ["https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=400&q=80"],
          city: "Orlando"
        },
        // Miami Area Spots
        {
          id: 10,
          name: "Miami Beach Skate Park",
          type: "park",
          difficulty: "intermediate",
          coordinates: [25.7907, -80.1300] as [number, number],
          description: "Beachfront skate park with ocean views",
          features: ["Ocean Views", "Concrete Bowls", "Street Course", "Parking"],
          hours: "6 AM - 10 PM",
          rating: 4.3,
          reviews: 145,
          crowdLevel: "high",
          photos: ["https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=400&q=80"],
          city: "Miami"
        },
        {
          id: 2,
          name: "Riverside Trail",
          type: "trail",
          difficulty: "beginner",
          coordinates: [34.0522, -118.2437] as [number, number],
          description: "Smooth waterfront trail perfect for cruising and beginners",
          features: ["Smooth Surface", "Waterfront Views", "Rest Areas", "Parking"],
          hours: "24/7",
          rating: 4.8,
          reviews: 89,
          crowdLevel: "high",
          photos: ["https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=400&q=80"],
          city: "Los Angeles"
        },
        {
          id: 3,
          name: "Downtown Bowl",
          type: "park",
          difficulty: "advanced",
          coordinates: [41.8781, -87.6298] as [number, number],
          description: "Historic skate park with deep bowls and challenging features",
          features: ["Historic", "Deep Bowls", "Street Course", "Parking"],
          hours: "6 AM - 10 PM",
          rating: 4.3,
          reviews: 95,
          crowdLevel: "low",
          photos: ["https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=400&q=80"],
          city: "Chicago"
        },
        {
          id: 4,
          name: "City Walkway",
          type: "trail",
          difficulty: "beginner",
          coordinates: [29.7604, -95.3698] as [number, number],
          description: "Scenic urban trail perfect for casual skating",
          features: ["Urban Views", "Smooth Surface", "Restaurants", "Parking"],
          hours: "24/7",
          rating: 4.6,
          reviews: 156,
          crowdLevel: "medium",
          photos: ["https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=400&q=80"],
          city: "Houston"
        },
        {
          id: 5,
          name: "Community Skate Park",
          type: "park",
          difficulty: "beginner",
          coordinates: [33.7490, -84.3880] as [number, number],
          description: "Family-friendly skate park with beginner-friendly features",
          features: ["Beginner Friendly", "Lighting", "Restrooms", "Playground"],
          hours: "8 AM - 8 PM",
          rating: 4.2,
          reviews: 73,
          crowdLevel: "medium",
          photos: ["https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=400&q=80"],
          city: "Atlanta"
        },
        {
          id: 6,
          name: "Nature Trail",
          type: "trail",
          difficulty: "intermediate",
          coordinates: [39.9526, -75.1652] as [number, number],
          description: "Paved trail through natural areas with scenic views",
          features: ["Natural Scenery", "Smooth Surface", "Rest Areas", "Parking"],
          hours: "6 AM - 8 PM",
          rating: 4.4,
          reviews: 67,
          crowdLevel: "low",
          photos: ["https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=400&q=80"],
          city: "Philadelphia"
        }
      ];
    return spotData;
  }, []);

  // Fetch database skate spots
  const fetchSkateSpots = async () => {
    setLoadingSpots(true);
    try {
      const response = await fetch('/api/skate-spots/area', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const spots = await response.json();
        const transformedSpots = spots.map((spot: any) => ({
          id: spot.id,
          name: spot.name,
          type: spot.type,
          difficulty: spot.difficulty,
          coordinates: [spot.latitude, spot.longitude] as [number, number],
          description: spot.description,
          features: spot.features ? JSON.parse(spot.features) : [],
          hours: spot.hours,
          rating: spot.rating,
          reviews: spot.reviews,
          crowdLevel: spot.crowd_level,
          photos: spot.photos ? JSON.parse(spot.photos) : [],
          city: spot.city || 'Tampa Area',
          source: 'database',
          approved: spot.approved,
          weather: null,
          weatherLoading: false
        }));

        // Fetch weather data for database spots too
        transformedSpots.forEach(async (spot: any) => {
          try {
            const weatherData = await fetchWeatherData(spot.coordinates[0], spot.coordinates[1]);

            // Update spots with weather data
            setSkateSpotsFromAPI((prevSpots: any[]) =>
              prevSpots.map((prevSpot: any) =>
                prevSpot.id === spot.id
                  ? { ...prevSpot, weather: weatherData }
                  : prevSpot
              )
            );
          } catch (error) {
            console.error(`Failed to fetch weather for ${spot.name}:`, error);
          }
        });

        console.log('Loaded database spots:', transformedSpots.length);
        setSkateSpotsFromAPI(transformedSpots);
        return transformedSpots;
      } else {
        throw new Error('Failed to fetch spots');
      }
    } catch (error) {
      console.error('Failed to load skate spots:', error);
      // Fallback to hardcoded data if anything fails
      console.log('Using fallback hardcoded spots');
      const fallbackSpots = skateSpots.map(spot => ({
        ...spot,
        source: 'database',
        id: Math.random().toString()
      }));
      setSkateSpotsFromAPI(fallbackSpots);
      return fallbackSpots;
    } finally {
      setLoadingSpots(false);
    }
  };

  // Generate cache key for API requests
  const generateCacheKey = React.useCallback((bounds: L.LatLngBounds, searchType: string) => {
    const sw = bounds.getSouthWest();
    const ne = bounds.getNorthEast();
    return `${searchType}_${sw.lat.toFixed(4)}_${sw.lng.toFixed(4)}_${ne.lat.toFixed(4)}_${ne.lng.toFixed(4)}`;
  }, []);

  // Helper function to extract features from Google Places data
  const extractFeatures = React.useCallback((place: any) => {
    const features = [];
    const types = place.types || [];

    if (place.opening_hours) features.push('Operating Hours');
    if (place.price_level !== undefined) features.push('Free Entry');
    if (types.includes('point_of_interest')) features.push('Popular Spot');
    if (place.photos && place.photos.length > 0) features.push('Photos Available');
    if (place.rating && place.rating > 4) features.push('Highly Rated');

    return features;
  }, []);

  // Helper function to extract city from vicinity
  const extractCity = React.useCallback((vicinity: string) => {
    if (!vicinity) return 'Unknown';
    const parts = vicinity.split(',');
    return parts[parts.length - 1].trim() || 'Unknown';
  }, []);

  // Fetch weather data for a location
  const fetchWeatherData = React.useCallback(async (lat: number, lng: number) => {
    const cacheKey = `${lat.toFixed(3)}_${lng.toFixed(3)}`;

    // Check cache first
    if (weatherCache.has(cacheKey)) {
      return weatherCache.get(cacheKey);
    }

    try {
      const response = await fetch(`/api/weather/${lat}/${lng}`);
      if (response.ok) {
        const data = await response.json();

        // Cache the weather data for 30 minutes
        setWeatherCache(prev => new Map(prev.set(cacheKey, data.weather)));
        setTimeout(() => {
          setWeatherCache(prev => {
            const newCache = new Map(prev);
            newCache.delete(cacheKey);
            return newCache;
          });
        }, 30 * 60 * 1000); // 30 minutes

        return data.weather;
      }
    } catch (error) {
      console.error('Error fetching weather:', error);
    }

    return null;
  }, [weatherCache]);

  // Discover real skate parks using Google Places API
  const discoverSkateParks = React.useCallback(async (bounds: L.LatLngBounds, zoom: number) => {
    if (!autoDiscovery) return [];

    const cacheKey = generateCacheKey(bounds, 'skate_parks');

    // Check cache first
    if (spotCache.has(cacheKey)) {
      console.log('Using cached API spots for area');
      return spotCache.get(cacheKey) || [];
    }

    setLoadingApiSpots(true);
    try {
      const center = bounds.getCenter();

      // Calculate radius based on zoom level (more focused search for higher zoom)
      const radius = Math.min(50000, Math.max(1000, 50000 / Math.pow(2, zoom - 10)));

      // Search terms based on zoom level and area size
      const searchTerms = zoom > 13
        ? ['park', 'skate park', 'skateboard park', 'skate spot']
        : ['park', 'skate park', 'skateboard park', 'recreational park', 'sports complex'];

      const allDiscoveredSpots: any[] = [];

      // Search for each term
      for (const term of searchTerms) {
        try {
          const response = await fetch(`/api/places/nearby`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              location: { lat: center.lat, lng: center.lng },
              radius: radius,
              keyword: term
            })
          });

          if (response.ok) {
            const data = await response.json();

            if (data.success && data.results) {
              const spotsWithCoords = data.results
                .filter((place: any) =>
                  place.geometry?.location &&
                  place.name &&
                  !allDiscoveredSpots.some(existing => existing.place_id === place.place_id)
                )
                .map((place: any) => ({
                  id: `api_${place.place_id}`,
                  place_id: place.place_id,
                  name: place.name,
                  type: determineSpotType(place),
                  difficulty: 'unknown',
                  coordinates: [
                    place.geometry.location.lat,
                    place.geometry.location.lng
                  ] as [number, number],
                  description: place.vicinity || '',
                  features: extractFeatures(place),
                  hours: place.opening_hours ? 'Check Google Maps' : 'Unknown',
                  rating: place.rating || 0,
                  reviews: place.user_ratings_total || 0,
                  crowdLevel: 'unknown',
                  photos: place.photos ? [place.photos[0].photo_reference] : [],
                  city: extractCity(place.vicinity),
                  source: 'api',
                  business_status: place.business_status,
                  price_level: place.price_level,
                  types: place.types || [],
                  approved: 0, // API spots are not auto-approved
                  weather: null, // Will be populated later
                  weatherLoading: false
                }));

              // Fetch weather data for each spot (but don't block the UI)
              const transformedSpots = spotsWithCoords.map((spot: any) => ({
                ...spot,
                weatherLoading: true
              }));

              // Fetch weather data in the background
              spotsWithCoords.forEach(async (spot: any) => {
                try {
                  const weatherData = await fetchWeatherData(spot.coordinates[0], spot.coordinates[1]);

                  // Update the spot with weather data
                  setVisibleSpots((prevSpots: any[]) =>
                    prevSpots.map((prevSpot: any) =>
                      prevSpot.id === spot.id
                        ? { ...prevSpot, weather: weatherData, weatherLoading: false }
                        : prevSpot
                    )
                  );

                  setApiSpots((prevSpots: any[]) =>
                    prevSpots.map((prevSpot: any) =>
                      prevSpot.id === spot.id
                        ? { ...prevSpot, weather: weatherData, weatherLoading: false }
                        : prevSpot
                    )
                  );
                } catch (error) {
                  console.error(`Failed to fetch weather for ${spot.name}:`, error);
                  // Update to remove loading state even on error
                  setVisibleSpots((prevSpots: any[]) =>
                    prevSpots.map((prevSpot: any) =>
                      prevSpot.id === spot.id
                        ? { ...prevSpot, weatherLoading: false }
                        : prevSpot
                    )
                  );
                }
              });

              allDiscoveredSpots.push(...transformedSpots);
            }
          }
        } catch (error) {
          console.error(`Error searching for ${term}:`, error);
        }
      }

      // Cache the results
      setSpotCache(prev => new Map(prev.set(cacheKey, allDiscoveredSpots)));

      console.log(`Discovered ${allDiscoveredSpots.length} potential skate spots`);
      return allDiscoveredSpots;

    } catch (error) {
      console.error('Error discovering skate parks:', error);
      return [];
    } finally {
      setLoadingApiSpots(false);
    }
  }, [autoDiscovery, generateCacheKey, spotCache, extractCity, extractFeatures, fetchWeatherData]);

  // Helper function to determine spot type from Google Places data
  const determineSpotType = (place: any) => {
    const types = place.types || [];
    const name = place.name.toLowerCase();

    if (name.includes('skate') && name.includes('park')) return 'park';
    if (types.includes('park')) return 'park';
    if (types.includes('tourist_attraction')) return 'street';
    if (name.includes('trail') || name.includes('path')) return 'trail';
    if (name.includes('plaza') || name.includes('square')) return 'street';

    return 'park'; // default
  };

  // Get weather icon with skating recommendation
  const getWeatherIcon = (weather: any) => {
    if (!weather) return '❓';

    const iconMap: Record<string, string> = {
      '01d': '☀️', '01n': '🌙', '02d': '⛅', '02n': '☁️',
      '03d': '☁️', '03n': '☁️', '04d': '☁️', '04n': '☁️',
      '09d': '🌧️', '09n': '🌧️', '10d': '🌦️', '10n': '🌧️',
      '11d': '⛈️', '11n': '⛈️', '13d': '❄️', '13n': '❄️',
      '50d': '🌫️', '50n': '🌫️'
    };

    return iconMap[weather.icon] || '🌤️';
  };

  // Check if weather is good for skating
  const isGoodSkatingWeather = (weather: any) => {
    if (!weather) return false;
    return weather.isSkateable === true;
  };

  // Save API spot to database
  const saveApiSpotToDatabase = async (apiSpot: any) => {
    try {
      const response = await fetch('/api/skate-spots', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          name: apiSpot.name,
          type: apiSpot.type,
          difficulty: 'intermediate', // Default for API spots
          latitude: apiSpot.coordinates[0],
          longitude: apiSpot.coordinates[1],
          description: `${apiSpot.description}\n\nDiscovered via Google Places API.`,
          features: JSON.stringify(apiSpot.features),
          hours: apiSpot.hours,
          google_place_id: apiSpot.place_id
        }),
      });

      if (response.ok) {
        alert('Spot saved successfully! It will appear after admin approval.');
        // Refresh database spots
        await fetchSkateSpots();
        return true;
      } else {
        alert('Failed to save spot. Please try again.');
        return false;
      }
    } catch (error) {
      console.error('Error saving API spot:', error);
      alert('Error saving spot. Please try again.');
      return false;
    }
  };

  // Filter spots based on map bounds and combine with API spots
  const filterSpotsInBounds = React.useCallback(async (bounds: L.LatLngBounds, zoom: number) => {
    // Filter database spots
    const databaseSpots = skateSpotsFromAPI.length > 0 ? skateSpotsFromAPI : skateSpots;
    console.log('Filtering spots. Total database spots:', databaseSpots.length, 'Bounds:', bounds);

    const filteredDatabaseSpots = databaseSpots.filter(spot => {
      const [lat, lng] = spot.coordinates;
      const isInBounds = bounds.contains([lat, lng]);
      if (isInBounds) {
        console.log('Database spot in bounds:', spot.name, 'at', lat, lng);
      }
      return isInBounds;
    });

    // Discover API spots for the area (if auto-discovery is enabled)
    let discoveredSpots: any[] = [];
    if (autoDiscovery && zoom > 10) { // Only search at reasonable zoom levels
      discoveredSpots = await discoverSkateParks(bounds, zoom);

      // Filter discovered spots to only those in bounds
      discoveredSpots = discoveredSpots.filter(spot => {
        const [lat, lng] = spot.coordinates;
        return bounds.contains([lat, lng]);
      });
    }

    // Combine and deduplicate spots
    const allSpots = [...filteredDatabaseSpots, ...discoveredSpots];

    // Remove any potential duplicates (same name and close coordinates)
    const uniqueSpots = allSpots.filter((spot, index, self) => {
      const firstIndex = self.findIndex(s =>
        s.name.toLowerCase() === spot.name.toLowerCase() &&
        Math.abs(s.coordinates[0] - spot.coordinates[0]) < 0.001 &&
        Math.abs(s.coordinates[1] - spot.coordinates[1]) < 0.001
      );
      return firstIndex === index;
    });

    console.log(`Total visible spots: ${uniqueSpots.length} (${filteredDatabaseSpots.length} database + ${discoveredSpots.length} discovered)`);
    setVisibleSpots(uniqueSpots);
    setApiSpots(discoveredSpots);
  }, [skateSpotsFromAPI, skateSpots, autoDiscovery, discoverSkateParks]);

  // Submit new skate spot
  const submitNewSpot = async (spotData: {
    name: string;
    type: string;
    difficulty: string;
    latitude: number;
    longitude: number;
    description: string;
    features: string[];
    hours: string;
  }) => {
    try {
      const response = await fetch('http://localhost:4000/api/skate-spots', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(spotData)
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Spot submitted successfully:', result);
        // Refresh spots after submission
        fetchSkateSpots();
        return { success: true, message: 'Skate spot submitted for approval!' };
      } else {
        const error = await response.json();
        return { success: false, message: error.error || 'Failed to submit spot' };
      }
    } catch (error) {
      console.error('Error submitting spot:', error);
      return { success: false, message: 'Network error. Please try again.' };
    }
  };

  // Auto-get user location and fetch skate spots on component mount
  React.useEffect(() => {
    const initializeMap = async () => {
      getUserLocation();
      const dbSpots = await fetchSkateSpots();

      // Initial spot discovery for the default map area
      if (autoDiscovery) {
        const initialBounds = L.latLngBounds(
          [27.9000, -82.5000], // Southwest
          [28.0000, -82.4000]  // Northeast (Tampa area)
        );
        await filterSpotsInBounds(initialBounds, mapZoom);
      } else {
        setVisibleSpots(dbSpots);
      }
    };

    initializeMap();

    // Cleanup timeouts on unmount
    return () => {
      if (autocompleteTimeout) {
        clearTimeout(autocompleteTimeout);
      }
      if (mapBoundsTimeout) {
        clearTimeout(mapBoundsTimeout);
      }
    };
  }, []); // Empty dependency array - only run on mount

  // Update spots when auto-discovery setting changes
  React.useEffect(() => {
    if (mapBounds) {
      filterSpotsInBounds(mapBounds, currentZoom);
    }
  }, [autoDiscovery, mapBounds, currentZoom, filterSpotsInBounds]);

  // Update visible spots when skate spots data changes
  React.useEffect(() => {
    console.log('useEffect triggered. API spots:', skateSpotsFromAPI.length, 'Map bounds:', mapBounds);

    if (skateSpotsFromAPI.length > 0) {
      // If we have map bounds, filter spots; otherwise show all
      if (mapBounds) {
        console.log('Filtering spots with bounds');
        filterSpotsInBounds(mapBounds, currentZoom);
      } else {
        console.log('No bounds, showing all API spots');
        setVisibleSpots(skateSpotsFromAPI);
      }
    } else {
      // Fallback to hardcoded spots
      console.log('No API spots, using hardcoded spots');
      setVisibleSpots(skateSpots);
    }
  }, [skateSpotsFromAPI, mapBounds, currentZoom, filterSpotsInBounds, skateSpots]);

  // Filter spots based on selection, weather, and map bounds
  const filteredSpots = React.useMemo(() => {
    let spots = visibleSpots;

    // Filter by type
    if (selectedFilter !== 'all') {
      spots = spots.filter(spot => spot.type === selectedFilter);
    }

    // Filter by weather if enabled
    if (showWeatherFilter) {
      spots = spots.filter(spot => {
        if (!spot.weather) return false; // Hide spots without weather data
        return isGoodSkatingWeather(spot.weather);
      });
    }

    return spots;
  }, [visibleSpots, selectedFilter, showWeatherFilter]);

  // Get user location and center map
  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation([latitude, longitude]);
          setMapCenter([latitude, longitude]);
          setMapZoom(12);
          setShowUserLocation(true);
          setSearchedLocation(null); // Clear searched location
        },
        (error) => {
          console.error('Error getting location:', error);
          alert('Unable to get your location. Please check your browser settings.');
        }
      );
    } else {
      alert('Geolocation is not supported by your browser.');
    }
  };

  // Search for city and center map
  const searchForCity = async () => {
    if (!searchCity.trim()) return;

    try {
      // Simple city coordinates mapping (in a real app, you'd use a geocoding API)
      const cityCoordinates: { [key: string]: [number, number] } = {
        // Florida Cities
        'tampa': [27.9506, -82.4572],
        'st. petersburg': [27.7731, -82.6400],
        'st petersburg': [27.7731, -82.6400],
        'clearwater': [27.9789, -82.8316],
        'orlando': [28.5383, -81.3792],
        'miami': [25.7617, -80.1918],
        'jacksonville': [30.3322, -81.6557],
        'fort lauderdale': [26.1224, -80.1373],
        'gainesville': [29.6516, -82.3248],
        'tallahassee': [30.4383, -84.2807],
        'sarasota': [27.3364, -82.5307],
        'naples': [26.1420, -81.7948],
        'key west': [24.5551, -81.7800],
        'daytona beach': [29.2108, -81.0228],
        'pensacola': [30.4213, -87.2169],
        'panama city': [30.1599, -85.6598],
        // Major US Cities (for reference)
        'new york': [40.7128, -74.0060],
        'los angeles': [34.0522, -118.2437],
        'chicago': [41.8781, -87.6298],
        'houston': [29.7604, -95.3698],
        'atlanta': [33.7490, -84.3880],
        'philadelphia': [39.9526, -75.1652],
        'seattle': [47.6062, -122.3321],
        'denver': [39.7392, -104.9903],
        'austin': [30.2672, -97.7431],
        'san francisco': [37.7749, -122.4194],
        'boston': [42.3601, -71.0589],
        'dallas': [32.7767, -96.7970],
        'phoenix': [33.4484, -112.0740],
        'las vegas': [36.1699, -115.1398]
      };

      const cityKey = searchCity.toLowerCase();
      const coordinates = cityCoordinates[cityKey];

      if (coordinates) {
        setMapCenter(coordinates);
        setMapZoom(10);
        setSearchedLocation(null); // Clear searched location
        setShowCitySearch(false);
        setSearchCity('');
      } else {
        alert('City not found. Try: Tampa, St. Petersburg, Clearwater, Orlando, Miami, Jacksonville, Fort Lauderdale, Gainesville, Tallahassee, Sarasota, Naples, Key West, Daytona Beach, Pensacola, or Panama City');
      }
    } catch (error) {
      console.error('Error searching city:', error);
      alert('Error searching for city. Please try again.');
    }
  };

  // Search for address and center map
  const searchForAddress = async () => {
    if (!searchAddress.trim()) return;

    setIsSearching(true);

    try {
      // Using OpenStreetMap Nominatim API for geocoding (free and no API key required)
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchAddress)}&limit=1`
      );

      if (!response.ok) {
        throw new Error('Geocoding service unavailable');
      }

      const data = await response.json();

      if (data && data.length > 0) {
        const { lat, lon } = data[0];
        const coordinates: [number, number] = [parseFloat(lat), parseFloat(lon)];

        setMapCenter(coordinates);
        setMapZoom(14); // Closer zoom for specific addresses
        setSearchedLocation(coordinates);
        setShowAddressSearch(false);
        setSearchAddress('');

        // Find nearby spots
        const nearbySpots = findNearbySpots(coordinates[0], coordinates[1], 50);

        // Show success message with the found location and nearby spots
        const displayName = data[0].display_name.split(',')[0]; // Get first part of address
        if (nearbySpots.length > 0) {
          alert(`Found location: ${displayName}\n\nNearby skate spots: ${nearbySpots.length} found within 50 miles`);
        } else {
          alert(`Found location: ${displayName}\n\nNo skate spots found within 50 miles. Try searching in a larger city!`);
        }
      } else {
        alert('Address not found. Please try a different address or be more specific.');
      }
    } catch (error) {
      console.error('Error searching address:', error);
      alert('Error searching for address. Please check your internet connection and try again.');
    } finally {
      setIsSearching(false);
    }
  };

  // Google Maps location search with enhanced features
  const handleLocationSearch = async () => {
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    setSearchError('');
    setSearchResults([]);
    setShowAutocomplete(false);

    try {
      const response = await fetch(`http://localhost:4000/api/search-location?query=${encodeURIComponent(searchQuery)}`);
      const data = await response.json();

      if (data.success) {
        const { lat, lng, formatted_address } = data.location;
        setSearchedLocation([lat, lng]);
        setMapCenter([lat, lng]);
        setMapZoom(13);

        // Find nearby spots
        const nearbySpots = findNearbySpots(lat, lng, 25);
        setVisibleSpots(nearbySpots);

        // Get nearby places
        const placesResponse = await fetch(`http://localhost:4000/api/nearby-places?lat=${lat}&lng=${lng}&radius=5000`);
        const placesData = await placesResponse.json();

        if (placesData.success) {
          setSearchResults(placesData.places);
        }
      } else {
        setSearchError(data.error || 'Location not found');
      }
    } catch (error) {
      console.error('Location search error:', error);
      setSearchError('Failed to search location. Please try again.');
    } finally {
      setIsSearching(false);
    }
  };

  const handleAutocomplete = async (input: string) => {
    if (input.length < 2) {
      setAutocompletePredictions([]);
      setShowAutocomplete(false);
      return;
    }

    // Clear existing timeout
    if (autocompleteTimeout) {
      clearTimeout(autocompleteTimeout);
    }

    // Set new timeout for debouncing (300ms delay)
    const timeout = setTimeout(async () => {
      try {
        const response = await fetch(`http://localhost:4000/api/autocomplete?input=${encodeURIComponent(input)}`);
        const data = await response.json();

        if (data.success) {
          setAutocompletePredictions(data.predictions);
          setShowAutocomplete(true);
        } else {
          setAutocompletePredictions([]);
          setShowAutocomplete(false);
        }
      } catch (error) {
        console.error('Autocomplete error:', error);
        setAutocompletePredictions([]);
        setShowAutocomplete(false);
      }
    }, 300);

    setAutocompleteTimeout(timeout);
  };

  const handleAutocompleteSelect = (prediction: any) => {
    setSearchQuery(prediction.description);
    setShowAutocomplete(false);
    setAutocompletePredictions([]);
    handleLocationSearch();
  };

  const handleSearchResultClick = (place: any) => {
    const lat = place.location.lat;
    const lng = place.location.lng;

    setSearchedLocation([lat, lng]);
    setMapCenter([lat, lng]);
    setMapZoom(15);

    // Find nearby spots
    const nearbySpots = findNearbySpots(lat, lng, 10);
    setVisibleSpots(nearbySpots);
  };

  // Get spots for current map area
  const getSpotsInArea = () => {
    // In a real app, you'd filter spots based on map bounds
    // For now, we'll show all spots
    return skateSpotsFromAPI.length > 0 ? skateSpotsFromAPI : skateSpots;
  };

  // Find nearby spots within a certain radius (in miles)
  const findNearbySpots = (centerLat: number, centerLng: number, radiusMiles: number = 50) => {
    const spotsToSearch = skateSpotsFromAPI.length > 0 ? skateSpotsFromAPI : skateSpots;
    return spotsToSearch.filter(spot => {
      const distance = calculateDistance(centerLat, centerLng, spot.coordinates[0], spot.coordinates[1]);
      return distance <= radiusMiles;
    });
  };

  // Get spots within current map bounds
  const getSpotsInBounds = (bounds: L.LatLngBounds | null) => {
    const spotsToSearch = skateSpotsFromAPI.length > 0 ? skateSpotsFromAPI : skateSpots;
    if (!bounds) return spotsToSearch;

    return spotsToSearch.filter(spot => {
      const [lat, lng] = spot.coordinates;
      return bounds.contains([lat, lng]);
    });
  };

  // Calculate distance between two points
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 3959; // Earth's radius in miles
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  // Get marker icon based on type and source
  const getMarkerIcon = (type: string, source: string = 'database') => {
    const isApiSpot = source === 'api';
    const iconColor = type === 'park' ? '#dc3545' : '#28a745';
    const borderColor = isApiSpot ? '#17a2b8' : 'white';
    const borderWidth = isApiSpot ? 3 : 2;

    return L.divIcon({
      className: 'custom-marker',
      html: `
        <div style="
          background-color: ${iconColor}; 
          width: 20px; 
          height: 20px; 
          border-radius: 50%; 
          border: ${borderWidth}px solid ${borderColor}; 
          box-shadow: 0 2px 4px rgba(0,0,0,0.3);
          position: relative;
        ">
          ${isApiSpot ? '<div style="position: absolute; top: -2px; right: -2px; width: 8px; height: 8px; background-color: #17a2b8; border-radius: 50%; border: 1px solid white;"></div>' : ''}
        </div>
      `,
      iconSize: [20, 20],
      iconAnchor: [10, 10]
    });
  };

  function RouteDrawer() {
    useMapEvents({
      click(e) {
        setRoute((r) => [...r, [e.latlng.lat, e.latlng.lng]]);
      },
    });
    return null;
  }

  // Map bounds tracker
  function MapBoundsTracker() {
    const map = useMapEvents({
      moveend: () => {
        const bounds = map.getBounds();
        const zoom = map.getZoom();
        console.log('Map moved. New bounds:', bounds, 'Zoom:', zoom);
        setMapBounds(bounds);
        setCurrentZoom(zoom);

        // Clear previous timeout
        if (mapBoundsTimeout) {
          clearTimeout(mapBoundsTimeout);
        }

        // Debounce API calls to avoid too many requests
        const newTimeout = setTimeout(() => {
          filterSpotsInBounds(bounds, zoom);
        }, 1000); // Wait 1 second after user stops moving map

        setMapBoundsTimeout(newTimeout);
      },
      zoomend: () => {
        const bounds = map.getBounds();
        const zoom = map.getZoom();
        console.log('Map zoomed. New bounds:', bounds, 'Zoom:', zoom);
        setMapBounds(bounds);
        setCurrentZoom(zoom);

        // Clear previous timeout
        if (mapBoundsTimeout) {
          clearTimeout(mapBoundsTimeout);
        }

        // Immediate update on zoom (more intentional user action)
        filterSpotsInBounds(bounds, zoom);
      }
    });
    return null;
  }

  const handleSave = () => {
    if (route.length > 1) {
      setSavedRoutes([...savedRoutes, route]);
      setRoute([]);
    }
  };

  const handleShare = () => {
    if (route.length > 1) {
      const text = JSON.stringify(route);
      navigator.clipboard.writeText(text);
      alert('Route copied to clipboard!');
    }
  };

  const handleAddSpot = () => {
    if (newSpot.name && newSpot.description) {
      // In a real app, this would save to the backend
      alert('Spot added successfully! (This is a demo - spots are not permanently saved)');
      setShowAddSpotModal(false);
      setNewSpot({ name: '', type: 'park', difficulty: 'beginner', description: '', lat: 0, lng: 0 });
    }
  };

  const getCrowdLevelColor = (level: string) => {
    switch (level) {
      case 'low': return '#28a745';
      case 'medium': return '#ffc107';
      case 'high': return '#dc3545';
      default: return '#6c757d';
    }
  };

  // Fetch enhanced spot data
  const fetchEnhancedSpotData = async (spotId: number) => {
    try {
      const response = await fetch(`http://localhost:4000/api/skate-spots/${spotId}/enhanced`);
      if (response.ok) {
        const data = await response.json();
        setEnhancedSpotData(data.spot);
        setShowEnhancedSpotModal(true);
      } else {
        console.error('Failed to fetch enhanced spot data');
      }
    } catch (error) {
      console.error('Error fetching enhanced spot data:', error);
    }
  };

  // Add review to spot
  const addReview = async (spotId: number, rating: number, comment: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:4000/api/skate-spots/${spotId}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ rating, comment })
      });

      if (response.ok) {
        alert('Review added successfully!');
        setShowReviewModal(false);
        // Refresh enhanced data if modal is open
        if (showEnhancedSpotModal && enhancedSpotData) {
          fetchEnhancedSpotData(spotId);
        }
      } else {
        alert('Failed to add review');
      }
    } catch (error) {
      console.error('Error adding review:', error);
      alert('Error adding review');
    }
  };

  // Add photo to spot
  const addPhoto = async (spotId: number, photoUrl: string, caption: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:4000/api/skate-spots/${spotId}/photos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ photoUrl, caption })
      });

      if (response.ok) {
        alert('Photo added successfully!');
        setShowPhotoModal(false);
        // Refresh enhanced data if modal is open
        if (showEnhancedSpotModal && enhancedSpotData) {
          fetchEnhancedSpotData(spotId);
        }
      } else {
        alert('Failed to add photo');
      }
    } catch (error) {
      console.error('Error adding photo:', error);
      alert('Error adding photo');
    }
  };

  return (
    <div className="skate-map-container">
      <div className="row">
        <div className="col-lg-9">
          <div className="map-header mb-3">
            <h2><i className="bi bi-geo-alt-fill me-2"></i>Skate Spots Map</h2>
            <p className="text-muted">
              Discover the best skating locations in your area •
              <span className="text-primary fw-bold ms-1">
                {visibleSpots.length} spots visible
              </span>
              {showWeatherFilter && (
                <span className="text-info ms-2">
                  <i className="bi bi-cloud-sun me-1"></i>Good weather only
                </span>
              )}
              {mapBounds && (
                <span className="text-muted ms-2">
                  (Zoom in/out to see more spots • Current zoom: {currentZoom})
                </span>
              )}
            </p>
          </div>

          <div className="map-controls mb-3">
            <div className="row align-items-center">
              <div className="col-md-3">
                <div className="d-flex flex-wrap gap-2">
                  <div className="btn-group" role="group">
                    <Button
                      variant={selectedFilter === 'all' ? 'primary' : 'outline-primary'}
                      size="sm"
                      onClick={() => setSelectedFilter('all')}
                    >
                      All Spots
                    </Button>
                    <Button
                      variant={selectedFilter === 'park' ? 'primary' : 'outline-primary'}
                      size="sm"
                      onClick={() => setSelectedFilter('park')}
                    >
                      <i className="bi bi-building me-1"></i>Parks
                    </Button>
                    <Button
                      variant={selectedFilter === 'trail' ? 'primary' : 'outline-primary'}
                      size="sm"
                      onClick={() => setSelectedFilter('trail')}
                    >
                      <i className="bi bi-sign-intersection me-1"></i>Trails
                    </Button>
                  </div>

                  {/* Auto-Discovery Toggle */}
                  <div className="d-flex align-items-center ms-2">
                    <Form.Check
                      type="switch"
                      id="auto-discovery-switch"
                      label={
                        <span className="small">
                          <i className="bi bi-compass me-1"></i>
                          Auto-discover {loadingApiSpots && <i className="bi bi-hourglass-split text-primary ms-1"></i>}
                        </span>
                      }
                      checked={autoDiscovery}
                      onChange={(e) => setAutoDiscovery(e.target.checked)}
                      className="small"
                    />
                  </div>

                  {/* Weather Filter Toggle */}
                  <div className="d-flex align-items-center ms-2">
                    <Form.Check
                      type="switch"
                      id="weather-filter-switch"
                      label={
                        <span className="small">
                          <i className="bi bi-cloud-sun me-1"></i>
                          Good weather only
                        </span>
                      }
                      checked={showWeatherFilter}
                      onChange={(e) => setShowWeatherFilter(e.target.checked)}
                      className="small"
                    />
                  </div>
                </div>
              </div>
              <div className="col-md-2 text-center">
                <Button
                  variant="outline-secondary"
                  size="sm"
                  onClick={() => {
                    setShowCitySearch(!showCitySearch);
                    setShowAddressSearch(false);
                  }}
                >
                  <i className="bi bi-building me-1"></i>Search City
                </Button>
                {showCitySearch && (
                  <div className="mt-2">
                    <div className="input-group input-group-sm">
                      <Form.Control
                        type="text"
                        placeholder="Enter city name..."
                        value={searchCity}
                        onChange={(e) => setSearchCity(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && searchForCity()}
                      />
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={searchForCity}
                      >
                        <i className="bi bi-search"></i>
                      </Button>
                    </div>
                  </div>
                )}
              </div>
              <div className="col-md-2 text-center">
                <Button
                  variant="success"
                  size="sm"
                  onClick={() => {
                    alert('Submit New Spot feature coming soon! This will allow users to add new skate spots to the map.');
                  }}
                >
                  <i className="bi bi-plus-circle me-1"></i>Add New Spot
                </Button>
              </div>
              <div className="col-md-3 text-center">
                <Button
                  variant="outline-warning"
                  size="sm"
                  onClick={() => {
                    setShowAddressSearch(!showAddressSearch);
                    setShowCitySearch(false);
                  }}
                >
                  <i className="bi bi-geo-alt me-1"></i>Search Address
                </Button>
                {showAddressSearch && (
                  <div className="mt-2">
                    <div className="input-group input-group-sm">
                      <Form.Control
                        type="text"
                        placeholder="Enter any address..."
                        value={searchAddress}
                        onChange={(e) => setSearchAddress(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && searchForAddress()}
                      />
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={searchForAddress}
                        disabled={isSearching}
                      >
                        {isSearching ? (
                          <i className="bi bi-hourglass-split"></i>
                        ) : (
                          <i className="bi bi-search"></i>
                        )}
                      </Button>
                    </div>
                  </div>
                )}
              </div>
              <div className="col-md-3 text-center">
                <Button
                  variant="outline-success"
                  size="sm"
                  onClick={() => {
                    setSearchQuery('');
                    setSearchResults([]);
                    setSearchError('');
                  }}
                >
                  <i className="bi bi-google me-1"></i>Google Maps Search
                </Button>
                <div className="mt-2 position-relative">
                  <div className="input-group input-group-sm">
                    <Form.Control
                      type="text"
                      placeholder="Search any location..."
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        handleAutocomplete(e.target.value);
                      }}
                      onKeyPress={(e) => e.key === 'Enter' && handleLocationSearch()}
                      onFocus={() => {
                        if (autocompletePredictions.length > 0) {
                          setShowAutocomplete(true);
                        }
                      }}
                    />
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={handleLocationSearch}
                      disabled={isSearching}
                    >
                      {isSearching ? (
                        <i className="bi bi-hourglass-split"></i>
                      ) : (
                        <i className="bi bi-search"></i>
                      )}
                    </Button>
                  </div>

                  {/* Autocomplete Dropdown */}
                  {showAutocomplete && autocompletePredictions.length > 0 && (
                    <div className="autocomplete-dropdown">
                      {autocompletePredictions.map((prediction, index) => (
                        <div
                          key={index}
                          className="autocomplete-item"
                          onClick={() => handleAutocompleteSelect(prediction)}
                        >
                          <i className="bi bi-geo-alt me-2"></i>
                          {prediction.description}
                        </div>
                      ))}
                    </div>
                  )}

                  {searchError && (
                    <div className="text-danger small mt-1">{searchError}</div>
                  )}
                  {searchResults.length > 0 && (
                    <div className="search-results mt-2">
                      <div className="search-results-header">
                        <small className="text-muted">Nearby Places:</small>
                      </div>
                      <div className="search-results-list">
                        {searchResults.slice(0, 5).map((place, index) => (
                          <div
                            key={index}
                            className="search-result-item"
                            onClick={() => handleSearchResultClick(place)}
                          >
                            <div className="place-name">{place.name}</div>
                            <div className="place-address">{place.address}</div>
                            {place.rating && (
                              <div className="place-rating">
                                <i className="bi bi-star-fill text-warning"></i>
                                {place.rating}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="col-md-3 text-end">
                <Button
                  variant="outline-info"
                  size="sm"
                  className="me-2"
                  onClick={getUserLocation}
                >
                  <i className="bi bi-geo-alt me-1"></i>My Location
                </Button>
                {user && (
                  <Button
                    variant="outline-success"
                    size="sm"
                    onClick={() => setShowAddSpotModal(true)}
                  >
                    <i className="bi bi-plus-circle me-1"></i>Add Spot
                  </Button>
                )}
              </div>
            </div>
          </div>

          <div className="map-container position-relative" style={{ height: '600px', width: '100%', marginBottom: 16 }}>
            {loadingSpots && (
              <div className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center bg-white bg-opacity-75" style={{ zIndex: 1000 }}>
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading skate spots...</span>
                </div>
              </div>
            )}
            <MapContainer center={mapCenter} zoom={mapZoom} style={{ height: '100%', width: '100%' }}>
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution="&copy; OpenStreetMap contributors"
              />
              <MapBoundsTracker />

              {/* Skate Spot Markers */}
              {visibleSpots.map((spot) => (
                <Marker
                  key={spot.id}
                  position={spot.coordinates}
                  icon={getMarkerIcon(spot.type, spot.source)}
                  eventHandlers={{
                    click: () => setSelectedSpot(spot)
                  }}
                >
                  <Popup>
                    <div className="spot-popup">
                      <h6 className="mb-2">
                        {spot.name}
                        {spot.source === 'api' && (
                          <i className="bi bi-compass text-info ms-1" title="Discovered via Google Places"></i>
                        )}
                      </h6>
                      <small className="text-muted d-block mb-2">{spot.city}</small>
                      <p className="text-muted small mb-2">{spot.description}</p>

                      {/* Weather Information */}
                      {spot.weather && (
                        <div className="weather-info mb-2 p-2 rounded" style={{
                          backgroundColor: isGoodSkatingWeather(spot.weather) ? '#d4edda' : '#f8d7da',
                          border: `1px solid ${isGoodSkatingWeather(spot.weather) ? '#c3e6cb' : '#f5c6cb'}`
                        }}>
                          <div className="d-flex align-items-center justify-content-between">
                            <span className="small fw-bold">
                              {getWeatherIcon(spot.weather)} {Math.round(spot.weather.temperature)}°C
                            </span>
                            <span className={`small ${isGoodSkatingWeather(spot.weather) ? 'text-success' : 'text-danger'}`}>
                              {isGoodSkatingWeather(spot.weather) ? '✅ Good for skating' : '❌ Poor conditions'}
                            </span>
                          </div>
                          <div className="small text-muted mt-1">
                            {spot.weather.description} • Wind: {Math.round(spot.weather.windSpeed * 3.6)} km/h
                          </div>
                        </div>
                      )}

                      {spot.weatherLoading && (
                        <div className="weather-loading mb-2 p-2 rounded bg-light text-center">
                          <small className="text-muted">
                            <i className="bi bi-hourglass-split me-1"></i>Loading weather...
                          </small>
                        </div>
                      )}

                      <div className="spot-details">
                        <div className="d-flex justify-content-between mb-1">
                          <span>Difficulty:</span>
                          <span className={`badge bg-${spot.difficulty === 'beginner' ? 'success' : spot.difficulty === 'intermediate' ? 'warning' : 'danger'}`}>
                            {spot.difficulty}
                          </span>
                        </div>
                        <div className="d-flex justify-content-between mb-1">
                          <span>Rating:</span>
                          <span>
                            <i className="bi bi-star-fill text-warning me-1"></i>
                            {spot.rating || 'N/A'}
                            {spot.reviews > 0 && ` (${spot.reviews})`}
                          </span>
                        </div>
                        <div className="d-flex justify-content-between mb-1">
                          <span>{spot.source === 'api' ? 'Status:' : 'Crowd:'}:</span>
                          <span style={{
                            color: spot.source === 'api'
                              ? (spot.business_status === 'OPERATIONAL' ? '#28a745' : '#dc3545')
                              : getCrowdLevelColor(spot.crowdLevel)
                          }}>
                            {spot.source === 'api'
                              ? (spot.business_status || 'Unknown').toLowerCase().replace('_', ' ')
                              : spot.crowdLevel
                            }
                          </span>
                        </div>
                        <div className="d-flex justify-content-between">
                          <span>Hours:</span>
                          <span className="small">{spot.hours}</span>
                        </div>
                      </div>
                      <div className="mt-2">
                        {spot.source === 'database' ? (
                          <Button
                            variant="outline-primary"
                            size="sm"
                            onClick={() => fetchEnhancedSpotData(spot.id)}
                          >
                            <i className="bi bi-info-circle me-1"></i>Enhanced Info
                          </Button>
                        ) : (
                          user && (
                            <Button
                              variant="outline-success"
                              size="sm"
                              onClick={() => saveApiSpotToDatabase(spot)}
                            >
                              <i className="bi bi-save me-1"></i>Save Spot
                            </Button>
                          )
                        )}
                      </div>
                    </div>
                  </Popup>
                </Marker>
              ))}

              {/* User Location */}
              {showUserLocation && userLocation && (
                <CircleMarker
                  center={userLocation}
                  radius={8}
                  pathOptions={{ color: '#007bff', fillColor: '#007bff', fillOpacity: 0.7 }}
                >
                  <Popup>Your Location</Popup>
                </CircleMarker>
              )}

              {/* Searched Address Location */}
              {searchedLocation && (
                <CircleMarker
                  center={searchedLocation}
                  radius={10}
                  pathOptions={{ color: '#ffc107', fillColor: '#ffc107', fillOpacity: 0.8 }}
                >
                  <Popup>Searched Address</Popup>
                </CircleMarker>
              )}

              {/* Route Drawing */}
              <RouteDrawer />
              {route.length > 1 && <Polyline positions={route} color="blue" weight={3} />}
            </MapContainer>
          </div>

          {/* Route Controls */}
          <div className="route-controls mb-3">
            <h5>Route Planning</h5>
            <p className="text-muted small">Click on the map to draw a route between skate spots</p>
            <Button variant="success" className="me-2" onClick={handleSave} disabled={route.length < 2}>
              <i className="bi bi-save me-1"></i>Save Route
            </Button>
            <Button variant="info" className="me-2" onClick={handleShare} disabled={route.length < 2}>
              <i className="bi bi-share me-1"></i>Share Route
            </Button>
            <Button variant="secondary" onClick={() => setRoute([])} disabled={route.length === 0}>
              <i className="bi bi-trash me-1"></i>Clear
            </Button>
          </div>

          {/* Saved Routes */}
          {savedRoutes.length > 0 && (
            <div className="saved-routes">
              <h5>Saved Routes</h5>
              {savedRoutes.map((r, i) => (
                <div key={i} className="saved-route-item mb-2 p-2 border rounded">
                  <span>Route {i + 1} ({r.length} points)</span>
                  <Button variant="outline-danger" size="sm" className="ms-2"
                    onClick={() => setSavedRoutes(prev => prev.filter((_, index) => index !== i))}>
                    Delete
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="col-lg-3">
          <div className="spots-sidebar">
            <h5 className="mb-3">
              Skate Spots ({filteredSpots.length})
              {loadingApiSpots && (
                <i className="bi bi-hourglass-split text-primary ms-2" title="Discovering new spots..."></i>
              )}
            </h5>

            {filteredSpots.map((spot) => (
              <div
                key={spot.id}
                className={`spot-card mb-3 p-3 border rounded cursor-pointer ${selectedSpot?.id === spot.id ? 'border-primary' : ''} ${spot.source === 'api' ? 'border-info' : ''}`}
                onClick={() => setSelectedSpot(spot)}
              >
                <div className="d-flex justify-content-between align-items-start mb-2">
                  <div className="flex-grow-1">
                    <h6 className="mb-1">
                      {spot.name}
                      {spot.source === 'api' && (
                        <i className="bi bi-compass text-info ms-1" title="Discovered via Google Places"></i>
                      )}
                    </h6>
                    {spot.source === 'api' && user && (
                      <Button
                        variant="outline-success"
                        size="sm"
                        className="mt-1"
                        onClick={(e) => {
                          e.stopPropagation();
                          saveApiSpotToDatabase(spot);
                        }}
                      >
                        <i className="bi bi-save me-1"></i>Save to Database
                      </Button>
                    )}
                  </div>
                  <div className="text-end">
                    <div className="d-flex gap-1 mb-1">
                      <span className={`badge bg-${spot.type === 'park' ? 'danger' : 'success'} me-1`}>
                        {spot.type}
                      </span>
                      {spot.source === 'api' && (
                        <span className="badge bg-info">
                          <i className="bi bi-compass"></i>
                        </span>
                      )}
                    </div>
                    <small className="text-muted d-block">{spot.city}</small>
                  </div>
                </div>
                <p className="text-muted small mb-2">{spot.description}</p>
                <div className="spot-meta">
                  <div className="d-flex justify-content-between align-items-center mb-1">
                    <span className="small">Rating:</span>
                    <span className="small">
                      <i className="bi bi-star-fill text-warning me-1"></i>
                      {spot.rating || 'N/A'}
                      {spot.reviews > 0 && <span className="text-muted ms-1">({spot.reviews})</span>}
                    </span>
                  </div>
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="small">
                      {spot.source === 'api' ? 'Status:' : 'Crowd:'}
                    </span>
                    <span className="small" style={{
                      color: spot.source === 'api'
                        ? (spot.business_status === 'OPERATIONAL' ? '#28a745' : '#dc3545')
                        : getCrowdLevelColor(spot.crowdLevel)
                    }}>
                      {spot.source === 'api'
                        ? (spot.business_status || 'Unknown').toLowerCase().replace('_', ' ')
                        : spot.crowdLevel
                      }
                    </span>
                  </div>

                  {/* Weather Info in Sidebar */}
                  {spot.weather && (
                    <div className="d-flex justify-content-between align-items-center mt-1">
                      <span className="small">Weather:</span>
                      <span className="small d-flex align-items-center">
                        {getWeatherIcon(spot.weather)}
                        <span className="ms-1">{Math.round(spot.weather.temperature)}°C</span>
                        {isGoodSkatingWeather(spot.weather) ? (
                          <i className="bi bi-check-circle-fill text-success ms-1" title="Good for skating"></i>
                        ) : (
                          <i className="bi bi-x-circle-fill text-danger ms-1" title="Poor conditions"></i>
                        )}
                      </span>
                    </div>
                  )}

                  {spot.weatherLoading && (
                    <div className="d-flex justify-content-between align-items-center mt-1">
                      <span className="small">Weather:</span>
                      <span className="small text-muted">
                        <i className="bi bi-hourglass-split"></i> Loading...
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* No spots message */}
            {filteredSpots.length === 0 && !loadingSpots && !loadingApiSpots && (
              <div className="text-center text-muted py-4">
                <i className="bi bi-search h4 mb-2 d-block"></i>
                <p>No spots found in this area.</p>
                {!autoDiscovery && (
                  <p className="small">
                    Try enabling auto-discovery to find more spots!
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add Spot Modal */}
      {showAddSpotModal && (
        <div className="modal-overlay" onClick={() => setShowAddSpotModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h5>Add New Skate Spot</h5>
              <Button
                type="button"
                className="btn-close"
                onClick={() => setShowAddSpotModal(false)}
              ></Button>
            </div>
            <div className="modal-body">
              <Form>
                <Form.Group className="mb-3">
                  <Form.Label>Spot Name</Form.Label>
                  <Form.Control
                    type="text"
                    value={newSpot.name}
                    onChange={(e) => setNewSpot({ ...newSpot, name: e.target.value })}
                    placeholder="Enter spot name"
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Type</Form.Label>
                  <Form.Select
                    value={newSpot.type}
                    onChange={(e) => setNewSpot({ ...newSpot, type: e.target.value })}
                  >
                    <option value="park">Skate Park</option>
                    <option value="trail">Trail</option>
                  </Form.Select>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Difficulty</Form.Label>
                  <Form.Select
                    value={newSpot.difficulty}
                    onChange={(e) => setNewSpot({ ...newSpot, difficulty: e.target.value })}
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </Form.Select>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    value={newSpot.description}
                    onChange={(e) => setNewSpot({ ...newSpot, description: e.target.value })}
                    placeholder="Describe the spot..."
                  />
                </Form.Group>
              </Form>
            </div>
            <div className="modal-footer">
              <Button variant="secondary" onClick={() => setShowAddSpotModal(false)}>
                Cancel
              </Button>
              <Button variant="primary" onClick={handleAddSpot}>
                Add Spot
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Spot Info Modal */}
      {showEnhancedSpotModal && enhancedSpotData && (
        <div className="modal-overlay" onClick={() => setShowEnhancedSpotModal(false)}>
          <div className="modal-content modal-lg" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h5><i className="bi bi-geo-alt-fill me-2"></i>{enhancedSpotData.name}</h5>
              <Button
                type="button"
                className="btn-close"
                onClick={() => setShowEnhancedSpotModal(false)}
              ></Button>
            </div>
            <div className="modal-body">
              <div className="enhanced-spot-info">
                {/* Weather Section */}
                {enhancedSpotData.weather && (
                  <div className="weather-section mb-4">
                    <h6><i className="bi bi-cloud-sun me-2"></i>Current Weather</h6>
                    <div className="row">
                      <div className="col-md-6">
                        <div className="weather-card p-3 border rounded">
                          <div className="d-flex align-items-center">
                            <div className="weather-icon me-3">
                              <i className="bi bi-thermometer-half fs-2"></i>
                            </div>
                            <div>
                              <div className="fw-bold">{enhancedSpotData.weather.temperature}°C</div>
                              <small className="text-muted">Feels like {enhancedSpotData.weather.feelsLike}°C</small>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="weather-card p-3 border rounded">
                          <div className="d-flex align-items-center">
                            <div className="weather-icon me-3">
                              <i className="bi bi-wind fs-2"></i>
                            </div>
                            <div>
                              <div className="fw-bold">{enhancedSpotData.weather.windSpeed} m/s</div>
                              <small className="text-muted">Wind Speed</small>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="mt-2">
                      <span className={`badge ${enhancedSpotData.weather.isSkateable ? 'bg-success' : 'bg-warning'}`}>
                        <i className="bi bi-check-circle me-1"></i>
                        {enhancedSpotData.weather.isSkateable ? 'Good for skating' : 'Check conditions'}
                      </span>
                    </div>
                  </div>
                )}

                {/* Google Places Data */}
                {enhancedSpotData.googleData && (
                  <div className="google-data-section mb-4">
                    <h6><i className="bi bi-google me-2"></i>Google Places Info</h6>
                    <div className="row">
                      <div className="col-md-6">
                        <p><strong>Address:</strong> {enhancedSpotData.googleData.address}</p>
                        {enhancedSpotData.googleData.phone && (
                          <p><strong>Phone:</strong> {enhancedSpotData.googleData.phone}</p>
                        )}
                        {enhancedSpotData.googleData.website && (
                          <p><strong>Website:</strong> <a href={enhancedSpotData.googleData.website} target="_blank" rel="noopener noreferrer">Visit Website</a></p>
                        )}
                      </div>
                      <div className="col-md-6">
                        <p><strong>Google Rating:</strong> ⭐ {enhancedSpotData.googleData.googleRating} ({enhancedSpotData.googleData.googleReviews} reviews)</p>
                        {enhancedSpotData.googleData.openingHours && enhancedSpotData.googleData.openingHours.length > 0 && (
                          <div>
                            <strong>Hours:</strong>
                            <ul className="list-unstyled ms-2">
                              {enhancedSpotData.googleData.openingHours.map((hour: string, index: number) => (
                                <li key={index} className="small">{hour}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Photos Section */}
                <div className="photos-section mb-4">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <h6><i className="bi bi-images me-2"></i>Photos</h6>
                    {user && (
                      <Button variant="outline-primary" size="sm" onClick={() => setShowPhotoModal(true)}>
                        <i className="bi bi-plus-circle me-1"></i>Add Photo
                      </Button>
                    )}
                  </div>
                  <div className="row">
                    {enhancedSpotData.photos && enhancedSpotData.photos.length > 0 ? (
                      enhancedSpotData.photos.slice(0, 6).map((photo: any, index: number) => (
                        <div key={index} className="col-md-4 mb-2">
                          <img
                            src={photo.photo_url}
                            alt={`Photo ${index + 1}`}
                            className="img-fluid rounded"
                            style={{ height: '120px', width: '100%', objectFit: 'cover' }}
                          />
                        </div>
                      ))
                    ) : (
                      <div className="col-12">
                        <p className="text-muted">No photos yet. Be the first to add one!</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Reviews Section */}
                <div className="reviews-section">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <h6><i className="bi bi-star me-2"></i>Reviews</h6>
                    {user && (
                      <Button variant="outline-primary" size="sm" onClick={() => setShowReviewModal(true)}>
                        <i className="bi bi-plus-circle me-1"></i>Add Review
                      </Button>
                    )}
                  </div>
                  {enhancedSpotData.reviews && enhancedSpotData.reviews.length > 0 ? (
                    <div className="reviews-list">
                      {enhancedSpotData.reviews.slice(0, 5).map((review: any, index: number) => (
                        <div key={index} className="review-item border-bottom pb-2 mb-2">
                          <div className="d-flex justify-content-between">
                            <span className="fw-bold">{review.username}</span>
                            <span className="text-warning">
                              {'⭐'.repeat(review.rating)}
                            </span>
                          </div>
                          <p className="mb-1">{review.comment}</p>
                          <small className="text-muted">{new Date(review.created_at).toLocaleDateString()}</small>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted">No reviews yet. Be the first to review this spot!</p>
                  )}
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <Button variant="secondary" onClick={() => setShowEnhancedSpotModal(false)}>
                Close
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Add Review Modal */}
      {showReviewModal && (
        <div className="modal-overlay" onClick={() => setShowReviewModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h5>Add Review</h5>
              <Button
                type="button"
                className="btn-close"
                onClick={() => setShowReviewModal(false)}
              ></Button>
            </div>
            <div className="modal-body">
              <Form>
                <Form.Group className="mb-3">
                  <Form.Label>Rating</Form.Label>
                  <Form.Select id="rating">
                    <option value="5">⭐⭐⭐⭐⭐ (5 stars)</option>
                    <option value="4">⭐⭐⭐⭐ (4 stars)</option>
                    <option value="3">⭐⭐⭐ (3 stars)</option>
                    <option value="2">⭐⭐ (2 stars)</option>
                    <option value="1">⭐ (1 star)</option>
                  </Form.Select>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Comment</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    id="reviewComment"
                    placeholder="Share your experience at this spot..."
                  />
                </Form.Group>
              </Form>
            </div>
            <div className="modal-footer">
              <Button variant="secondary" onClick={() => setShowReviewModal(false)}>
                Cancel
              </Button>
              <Button variant="primary" onClick={() => {
                const rating = parseInt((document.getElementById('rating') as HTMLSelectElement).value);
                const comment = (document.getElementById('reviewComment') as HTMLTextAreaElement).value;
                if (comment.trim()) {
                  addReview(enhancedSpotData.id, rating, comment);
                } else {
                  alert('Please enter a comment');
                }
              }}>
                Submit Review
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Add Photo Modal */}
      {showPhotoModal && (
        <div className="modal-overlay" onClick={() => setShowPhotoModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h5>Add Photo</h5>
              <Button
                type="button"
                className="btn-close"
                onClick={() => setShowPhotoModal(false)}
              ></Button>
            </div>
            <div className="modal-body">
              <Form>
                <Form.Group className="mb-3">
                  <Form.Label>Photo URL</Form.Label>
                  <Form.Control
                    type="url"
                    id="photoUrl"
                    placeholder="Enter photo URL (e.g., from Instagram, Imgur, etc.)"
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Caption (Optional)</Form.Label>
                  <Form.Control
                    type="text"
                    id="photoCaption"
                    placeholder="Add a caption for your photo..."
                  />
                </Form.Group>
              </Form>
            </div>
            <div className="modal-footer">
              <Button variant="secondary" onClick={() => setShowPhotoModal(false)}>
                Cancel
              </Button>
              <Button variant="primary" onClick={() => {
                const photoUrl = (document.getElementById('photoUrl') as HTMLInputElement).value;
                const caption = (document.getElementById('photoCaption') as HTMLInputElement).value;
                if (photoUrl.trim()) {
                  addPhoto(enhancedSpotData.id, photoUrl, caption);
                } else {
                  alert('Please enter a photo URL');
                }
              }}>
                Add Photo
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Events page with Calendar (public)
const Events = () => {
  const [events, setEvents] = React.useState<any[]>([]);
  const [pendingEvents, setPendingEvents] = React.useState<any[]>([]);
  const [title, setTitle] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [date, setDate] = React.useState('');
  const [startTime, setStartTime] = React.useState('');
  const [endTime, setEndTime] = React.useState('');
  const [location, setLocation] = React.useState('');
  const [eventType, setEventType] = React.useState('');
  const [skillLevel, setSkillLevel] = React.useState('');
  const [maxParticipants, setMaxParticipants] = React.useState('');
  const [contactEmail, setContactEmail] = React.useState('');
  const [contactPhone, setContactPhone] = React.useState('');
  const [cost, setCost] = React.useState('');
  const [equipment, setEquipment] = React.useState('');
  const [eventPhoto, setEventPhoto] = React.useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = React.useState<string>('');
  const [message, setMessage] = React.useState('');
  const [currentDate, setCurrentDate] = React.useState(new Date());
  const [selectedDate, setSelectedDate] = React.useState<Date | null>(null);
  const [showForm, setShowForm] = React.useState(false);
  const [showAddEventForm, setShowAddEventForm] = React.useState(false);
  const { user, role } = useAuth();

  // Ref for auto-scrolling to form
  const formRef = React.useRef<HTMLDivElement>(null);

  const fetchEvents = async () => {
    try {
      const response = await fetch('http://localhost:4000/api/events');
      const data = await response.json();
      setEvents(data.events || []);
    } catch (error) {
      console.error('Failed to fetch events:', error);
    }
  };

  const fetchPendingEvents = async () => {
    if (role === 'admin') {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const response = await fetch('http://localhost:4000/api/events/pending', {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (response.status === 401) {
          console.log('Token expired for pending events fetch');
          localStorage.removeItem('token');
          return;
        }

        const data = await response.json();
        setPendingEvents(data.events || []);
      } catch (error) {
        console.error('Failed to fetch pending events:', error);
      }
    }
  };

  const checkAuthStatus = async () => {
    const token = localStorage.getItem('token');
    if (!token) return false;

    try {
      const response = await fetch('http://localhost:4000/api/me', {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.status === 401) {
        localStorage.removeItem('token');
        return false;
      }

      return true;
    } catch (error) {
      console.error('Auth check failed:', error);
      return false;
    }
  };

  React.useEffect(() => {
    fetchEvents();
    fetchPendingEvents();
  }, [message, role]);

  // Test backend connection on component mount
  React.useEffect(() => {
    const testConnection = async () => {
      try {
        const response = await fetch('http://localhost:4000/api/events');
        if (!response.ok) {
          console.error('Backend connection failed:', response.status);
        }
      } catch (error) {
        console.error('Backend connection error:', error);
      }
    };
    testConnection();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    if (!user) {
      setMessage('You must be logged in to submit an event.');
      return;
    }

    // Check authentication status first
    const isAuthenticated = await checkAuthStatus();
    if (!isAuthenticated) {
      setMessage('Authentication failed. Please log in again.');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      setMessage('Authentication token not found. Please log in again.');
      return;
    }

    try {
      // Create FormData for file upload
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      formData.append('date', date);
      formData.append('startTime', startTime);
      formData.append('endTime', endTime);
      formData.append('location', location);
      formData.append('eventType', eventType);
      formData.append('skillLevel', skillLevel);
      formData.append('maxParticipants', maxParticipants || '');
      formData.append('contactEmail', contactEmail);
      formData.append('contactPhone', contactPhone || '');
      formData.append('cost', cost || 'Free');
      formData.append('equipment', equipment || '');

      if (eventPhoto) {
        formData.append('eventPhoto', eventPhoto);
      }

      const res = await fetch('http://localhost:4000/api/events', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (res.ok) {
        setMessage('Event submitted for approval! It will appear on the calendar once approved by an admin.');
        setTitle('');
        setDescription('');
        setDate('');
        setStartTime('');
        setEndTime('');
        setLocation('');
        setEventType('');
        setSkillLevel('');
        setMaxParticipants('');
        setContactEmail('');
        setContactPhone('');
        setCost('');
        setEquipment('');
        setEventPhoto(null);
        setPhotoPreview('');
        setShowForm(false);
        setShowAddEventForm(false);
        fetchEvents(); // Refresh events list
        fetchPendingEvents(); // Refresh pending events for admins
      } else {
        const data = await res.json();
        if (res.status === 401) {
          setMessage('Authentication failed. Please log in again.');
          // Clear invalid token
          localStorage.removeItem('token');
        } else {
          setMessage(data.error || 'Failed to submit event');
        }
      }
    } catch (error) {
      console.error('Error submitting event:', error);
      setMessage('Network error. Please try again.');
    }
  };

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    // Auto-fill the date in the form
    const formattedDate = date.toISOString().split('T')[0];
    setDate(formattedDate);
    setShowAddEventForm(true);
    // Auto-scroll to form after a short delay to ensure it's rendered
    setTimeout(() => {
      formRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }, 100);
  };

  const handleAddEventClick = () => {
    setShowForm(true);
    // Auto-scroll to form after a short delay to ensure it's rendered
    setTimeout(() => {
      formRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }, 100);
  };

  // Calendar functions
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();

    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDay; i++) {
      days.push(null);
    }

    // Add all days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }

    return days;
  };

  const getEventsForDate = (date: Date) => {
    return events.filter(event => {
      const eventDate = new Date(event.date);
      return eventDate.toDateString() === date.toDateString() && event.approved === 1;
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  const isToday = (date: Date) => {
    return date.toDateString() === new Date().toDateString();
  };

  const isSelected = (date: Date) => {
    return selectedDate && date.toDateString() === selectedDate.toDateString();
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(newDate.getMonth() - 1);
      } else {
        newDate.setMonth(newDate.getMonth() + 1);
      }
      return newDate;
    });
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const days = getDaysInMonth(currentDate);
  const selectedDateEvents = selectedDate ? getEventsForDate(selectedDate) : [];
  const selectedDatePendingEvents = selectedDate && role === 'admin' ?
    pendingEvents.filter(event => {
      const eventDate = new Date(event.date);
      return eventDate.toDateString() === selectedDate.toDateString();
    }) : [];

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2><i className="bi bi-calendar-event me-2"></i>Events Calendar</h2>
        <Button variant="primary" onClick={handleAddEventClick}>
          <i className="bi bi-plus-circle me-2"></i>Add Event
        </Button>
      </div>

      {/* Calendar Component */}
      <div className="row">
        <div className="col-lg-8">
          <div className="card mb-4">
            <div className="card-header">
              <div className="d-flex justify-content-between align-items-center">
                <Button
                  variant="outline-primary"
                  size="sm"
                  onClick={() => navigateMonth('prev')}
                >
                  <i className="bi bi-chevron-left"></i>
                </Button>
                <h4 className="mb-0">
                  {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                </h4>
                <Button
                  variant="outline-primary"
                  size="sm"
                  onClick={() => navigateMonth('next')}
                >
                  <i className="bi bi-chevron-right"></i>
                </Button>
              </div>
            </div>
            <div className="card-body">
              <div className="calendar-grid">
                {/* Day headers */}
                <div className="calendar-header">
                  {dayNames.map(day => (
                    <div key={day} className="calendar-day-header">
                      {day}
                    </div>
                  ))}
                </div>

                {/* Calendar days */}
                <div className="calendar-days">
                  {days.map((date, index) => (
                    <div
                      key={index}
                      className={`calendar-day ${!date ? 'empty' : ''} ${date && isToday(date) ? 'today' : ''
                        } ${date && isSelected(date) ? 'selected' : ''
                        } ${date && getEventsForDate(date).length > 0 ? 'has-events' : ''
                        }`}
                      onClick={() => date && handleDateClick(date)}
                    >
                      {date && (
                        <>
                          <span className="day-number">{date.getDate()}</span>
                          {getEventsForDate(date).length > 0 && (
                            <div className="event-indicator">
                              <span className="event-dot"></span>
                              {getEventsForDate(date).length > 1 && (
                                <span className="event-count">{getEventsForDate(date).length}</span>
                              )}
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Events for Selected Date */}
        <div className="col-lg-4">
          <div className="card">
            <div className="card-header">
              <h5>
                {selectedDate ? (
                  <>
                    <i className="bi bi-calendar-date me-2"></i>
                    Events for {formatDate(selectedDate)}
                  </>
                ) : (
                  <>
                    <i className="bi bi-calendar-event me-2"></i>
                    Select a Date
                  </>
                )}
              </h5>
            </div>
            <div className="card-body">
              {selectedDate ? (
                <>
                  {/* Approved Events */}
                  {selectedDateEvents.length > 0 && (
                    <div className="mb-3">
                      <h6 className="text-success mb-2">
                        <i className="bi bi-check-circle me-1"></i>
                        Approved Events
                      </h6>
                      <div className="selected-date-events">
                        {selectedDateEvents.map((event) => (
                          <div key={event.id} className="event-item mb-3">
                            <h6 className="event-title">{event.title}</h6>
                            <p className="event-description">{event.description}</p>
                            <small className="text-muted">
                              <i className="bi bi-person me-1"></i>
                              {event.submittedBy}
                            </small>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Pending Events (Admin Only) */}
                  {role === 'admin' && selectedDatePendingEvents.length > 0 && (
                    <div className="mb-3">
                      <h6 className="text-warning mb-2">
                        <i className="bi bi-clock me-1"></i>
                        Pending Approval
                      </h6>
                      <div className="selected-date-events">
                        {selectedDatePendingEvents.map((event) => (
                          <div key={event.id} className="event-item mb-3 border-warning">
                            <h6 className="event-title">{event.title}</h6>
                            <p className="event-description">{event.description}</p>
                            <small className="text-muted">
                              <i className="bi bi-person me-1"></i>
                              {event.submittedBy}
                            </small>
                            <div className="mt-2">
                              <Button
                                variant="success"
                                size="sm"
                                className="me-2"
                                onClick={async () => {
                                  const token = localStorage.getItem('token');
                                  await fetch(`http://localhost:4000/api/events/${event.id}/approve`, {
                                    method: 'POST',
                                    headers: { Authorization: `Bearer ${token}` }
                                  });
                                  fetchEvents();
                                  fetchPendingEvents();
                                }}
                              >
                                <i className="bi bi-check me-1"></i>
                                Approve
                              </Button>
                              <Button
                                variant="danger"
                                size="sm"
                                onClick={async () => {
                                  const token = localStorage.getItem('token');
                                  await fetch(`http://localhost:4000/api/events/${event.id}`, {
                                    method: 'DELETE',
                                    headers: { Authorization: `Bearer ${token}` }
                                  });
                                  fetchEvents();
                                  fetchPendingEvents();
                                }}
                              >
                                <i className="bi bi-x me-1"></i>
                                Reject
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* No Events */}
                  {selectedDateEvents.length === 0 && selectedDatePendingEvents.length === 0 && (
                    <div className="text-center">
                      <p className="text-muted mb-3">No events scheduled for this date.</p>
                      <Button
                        variant="outline-primary"
                        size="sm"
                        onClick={() => setShowAddEventForm(true)}
                      >
                        <i className="bi bi-plus-circle me-1"></i>
                        Add Event for {formatDate(selectedDate)}
                      </Button>
                    </div>
                  )}
                </>
              ) : (
                <p className="text-muted">Click on a date to view events or add a new one.</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Add Event Form */}
      {(showForm || showAddEventForm) && (
        <div className="card mb-4" ref={formRef}>
          <div className="card-header">
            <h5>
              {showAddEventForm && selectedDate ? (
                <>
                  <i className="bi bi-calendar-plus me-2"></i>
                  Add Event for {formatDate(selectedDate)}
                </>
              ) : (
                <>
                  <i className="bi bi-plus-circle me-2"></i>
                  Submit New Event
                </>
              )}
            </h5>
          </div>
          <div className="card-body">
            <Form onSubmit={handleSubmit}>
              <div className="row">
                <div className="col-md-6">
                  <Form.Group className="mb-3">
                    <Form.Label>Event Title *</Form.Label>
                    <Form.Control
                      value={title}
                      onChange={e => setTitle(e.target.value)}
                      placeholder="Enter event title..."
                      required
                    />
                  </Form.Group>
                </div>
                <div className="col-md-6">
                  <Form.Group className="mb-3">
                    <Form.Label>Event Type *</Form.Label>
                    <Form.Select
                      value={eventType}
                      onChange={e => setEventType(e.target.value)}
                      required
                    >
                      <option value="">Select event type...</option>
                      <option value="competition">Competition</option>
                      <option value="workshop">Workshop/Clinic</option>
                      <option value="meetup">Skate Meetup</option>
                      <option value="demo">Demo/Show</option>
                      <option value="tournament">Tournament</option>
                      <option value="jam">Skate Jam</option>
                      <option value="other">Other</option>
                    </Form.Select>
                  </Form.Group>
                </div>
              </div>

              <Form.Group className="mb-3">
                <Form.Label>Description *</Form.Label>
                <Form.Control
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  as="textarea"
                  rows={3}
                  placeholder="Describe your event, what to expect, special features..."
                  required
                />
              </Form.Group>

              <div className="row">
                <div className="col-md-4">
                  <Form.Group className="mb-3">
                    <Form.Label>Date *</Form.Label>
                    <Form.Control
                      type="date"
                      value={date}
                      onChange={e => setDate(e.target.value)}
                      required
                    />
                  </Form.Group>
                </div>
                <div className="col-md-4">
                  <Form.Group className="mb-3">
                    <Form.Label>Start Time *</Form.Label>
                    <Form.Control
                      type="time"
                      value={startTime}
                      onChange={e => setStartTime(e.target.value)}
                      required
                    />
                  </Form.Group>
                </div>
                <div className="col-md-4">
                  <Form.Group className="mb-3">
                    <Form.Label>End Time *</Form.Label>
                    <Form.Control
                      type="time"
                      value={endTime}
                      onChange={e => setEndTime(e.target.value)}
                      required
                    />
                  </Form.Group>
                </div>
              </div>

              <div className="row">
                <div className="col-md-6">
                  <Form.Group className="mb-3">
                    <Form.Label>Location *</Form.Label>
                    <Form.Control
                      value={location}
                      onChange={e => setLocation(e.target.value)}
                      placeholder="Skate park, address, or venue name..."
                      required
                    />
                  </Form.Group>
                </div>
                <div className="col-md-6">
                  <Form.Group className="mb-3">
                    <Form.Label>Skill Level</Form.Label>
                    <Form.Select
                      value={skillLevel}
                      onChange={e => setSkillLevel(e.target.value)}
                    >
                      <option value="">All skill levels</option>
                      <option value="beginner">Beginner</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="advanced">Advanced</option>
                      <option value="pro">Professional</option>
                    </Form.Select>
                  </Form.Group>
                </div>
              </div>

              <div className="row">
                <div className="col-md-6">
                  <Form.Group className="mb-3">
                    <Form.Label>Max Participants</Form.Label>
                    <Form.Control
                      type="number"
                      value={maxParticipants}
                      onChange={e => setMaxParticipants(e.target.value)}
                      placeholder="Leave empty for unlimited"
                      min="1"
                    />
                  </Form.Group>
                </div>
                <div className="col-md-6">
                  <Form.Group className="mb-3">
                    <Form.Label>Cost</Form.Label>
                    <Form.Control
                      value={cost}
                      onChange={e => setCost(e.target.value)}
                      placeholder="Free, $10, etc."
                    />
                  </Form.Group>
                </div>
              </div>

              <div className="row">
                <div className="col-md-6">
                  <Form.Group className="mb-3">
                    <Form.Label>Contact Email *</Form.Label>
                    <Form.Control
                      type="email"
                      value={contactEmail}
                      onChange={e => setContactEmail(e.target.value)}
                      placeholder="your@email.com"
                      required
                    />
                  </Form.Group>
                </div>
                <div className="col-md-6">
                  <Form.Group className="mb-3">
                    <Form.Label>Contact Phone</Form.Label>
                    <Form.Control
                      type="tel"
                      value={contactPhone}
                      onChange={e => setContactPhone(e.target.value)}
                      placeholder="(555) 123-4567"
                    />
                  </Form.Group>
                </div>
              </div>

              <Form.Group className="mb-3">
                <Form.Label>Required Equipment</Form.Label>
                <Form.Control
                  value={equipment}
                  onChange={e => setEquipment(e.target.value)}
                  placeholder="Helmet, pads, specific gear, etc. (optional)"
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Event Photo</Form.Label>
                <Form.Control
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = (e.target as HTMLInputElement).files?.[0];
                    if (file) {
                      setEventPhoto(file);
                      const reader = new FileReader();
                      reader.onload = (e) => {
                        setPhotoPreview(e.target?.result as string);
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                />
                {photoPreview && (
                  <div className="mt-2">
                    <img
                      src={photoPreview}
                      alt="Event preview"
                      style={{ maxWidth: '200px', maxHeight: '200px', objectFit: 'cover' }}
                      className="border rounded"
                    />
                    <Button
                      size="sm"
                      variant="outline-danger"
                      className="ms-2"
                      onClick={() => {
                        setEventPhoto(null);
                        setPhotoPreview('');
                      }}
                    >
                      Remove
                    </Button>
                  </div>
                )}
              </Form.Group>
              <div className="d-flex gap-2">
                <Button type="submit" variant="primary">
                  <i className="bi bi-check-circle me-1"></i>
                  Submit Event
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => {
                    setShowForm(false);
                    setShowAddEventForm(false);
                    setTitle('');
                    setDescription('');
                    setDate('');
                    setStartTime('');
                    setEndTime('');
                    setLocation('');
                    setEventType('');
                    setSkillLevel('');
                    setMaxParticipants('');
                    setContactEmail('');
                    setContactPhone('');
                    setCost('');
                    setEquipment('');
                    setEventPhoto(null);
                    setPhotoPreview('');
                    setMessage('');
                  }}
                >
                  <i className="bi bi-x-circle me-1"></i>
                  Cancel
                </Button>
              </div>
            </Form>
            {message && <div className="mt-2 alert alert-info">{message}</div>}
          </div>
        </div>
      )}

      {/* All Events List */}
      <div className="card">
        <div className="card-header">
          <h5><i className="bi bi-list-ul me-2"></i>All Approved Events</h5>
        </div>
        <div className="card-body">
          <div className="row">
            {events.length === 0 ? (
              <div className="col-12">
                <p className="text-muted text-center">No approved events yet.</p>
              </div>
            ) : (
              events.map((event) => (
                <div key={event.id} className="col-md-6 col-lg-4 mb-3">
                  <div className="card h-100">
                    {event.eventPhoto && (
                      <img
                        src={`http://localhost:4000${event.eventPhoto}`}
                        className="card-img-top"
                        alt={event.title}
                        style={{ height: '200px', objectFit: 'cover' }}
                      />
                    )}
                    <div className="card-body">
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <h6 className="card-title mb-0">{event.title}</h6>
                        <span className={`badge bg-${event.eventType === 'competition' ? 'danger' : event.eventType === 'workshop' ? 'info' : 'success'}`}>
                          {event.eventType}
                        </span>
                      </div>
                      <p className="card-text">{event.description}</p>

                      <div className="mb-2">
                        <p className="text-muted mb-1">
                          <i className="bi bi-calendar me-1"></i>
                          {new Date(event.date).toLocaleDateString()}
                        </p>
                        <p className="text-muted mb-1">
                          <i className="bi bi-clock me-1"></i>
                          {event.startTime} - {event.endTime}
                        </p>
                        <p className="text-muted mb-1">
                          <i className="bi bi-geo-alt me-1"></i>
                          {event.location}
                        </p>
                        {event.skillLevel && (
                          <p className="text-muted mb-1">
                            <i className="bi bi-person-check me-1"></i>
                            {event.skillLevel} level
                          </p>
                        )}
                        {event.cost && (
                          <p className="text-muted mb-1">
                            <i className="bi bi-currency-dollar me-1"></i>
                            {event.cost}
                          </p>
                        )}
                        {event.maxParticipants && (
                          <p className="text-muted mb-1">
                            <i className="bi bi-people me-1"></i>
                            Max: {event.maxParticipants} participants
                          </p>
                        )}
                      </div>

                      <p className="text-muted mb-0">
                        <i className="bi bi-person me-1"></i>
                        Submitted by: {event.submittedBy}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Pending Events (Admin Only) */}
      {role === 'admin' && pendingEvents.length > 0 && (
        <div className="card">
          <div className="card-header">
            <h5><i className="bi bi-clock me-2"></i>Pending Approval ({pendingEvents.length})</h5>
          </div>
          <div className="card-body">
            <div className="row">
              {pendingEvents.map((event) => (
                <div key={event.id} className="col-md-6 col-lg-4 mb-3">
                  <div className="card h-100 border-warning">
                    <div className="card-header bg-warning text-dark">
                      <h6 className="mb-0">
                        <i className="bi bi-clock me-1"></i>
                        Pending Approval
                      </h6>
                    </div>
                    {event.eventPhoto && (
                      <img
                        src={`http://localhost:4000${event.eventPhoto}`}
                        className="card-img-top"
                        alt={event.title}
                        style={{ height: '200px', objectFit: 'cover' }}
                      />
                    )}
                    <div className="card-body">
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <h6 className="card-title mb-0">{event.title}</h6>
                        <span className={`badge bg-${event.eventType === 'competition' ? 'danger' : event.eventType === 'workshop' ? 'info' : 'success'}`}>
                          {event.eventType}
                        </span>
                      </div>
                      <p className="card-text">{event.description}</p>

                      <div className="mb-2">
                        <p className="text-muted mb-1">
                          <i className="bi bi-calendar me-1"></i>
                          {new Date(event.date).toLocaleDateString()}
                        </p>
                        <p className="text-muted mb-1">
                          <i className="bi bi-clock me-1"></i>
                          {event.startTime} - {event.endTime}
                        </p>
                        <p className="text-muted mb-1">
                          <i className="bi bi-geo-alt me-1"></i>
                          {event.location}
                        </p>
                        {event.skillLevel && (
                          <p className="text-muted mb-1">
                            <i className="bi bi-person-check me-1"></i>
                            {event.skillLevel} level
                          </p>
                        )}
                        {event.cost && (
                          <p className="text-muted mb-1">
                            <i className="bi bi-currency-dollar me-1"></i>
                            {event.cost}
                          </p>
                        )}
                        {event.maxParticipants && (
                          <p className="text-muted mb-1">
                            <i className="bi bi-people me-1"></i>
                            Max: {event.maxParticipants} participants
                          </p>
                        )}
                      </div>

                      <p className="text-muted mb-0">
                        <i className="bi bi-person me-1"></i>
                        Submitted by: {event.submittedBy}
                      </p>
                      <div className="mt-3">
                        <Button
                          variant="success"
                          size="sm"
                          className="me-2"
                          onClick={async () => {
                            const token = localStorage.getItem('token');
                            await fetch(`http://localhost:4000/api/events/${event.id}/approve`, {
                              method: 'POST',
                              headers: { Authorization: `Bearer ${token}` }
                            });
                            fetchEvents();
                            fetchPendingEvents();
                          }}
                        >
                          <i className="bi bi-check me-1"></i>
                          Approve
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={async () => {
                            const token = localStorage.getItem('token');
                            await fetch(`http://localhost:4000/api/events/${event.id}`, {
                              method: 'DELETE',
                              headers: { Authorization: `Bearer ${token}` }
                            });
                            fetchEvents();
                            fetchPendingEvents();
                          }}
                        >
                          <i className="bi bi-x me-1"></i>
                          Reject
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Admin Events page (admin only)
const AdminEvents = () => {
  const [pending, setPending] = React.useState<any[]>([]);
  const { user, role } = useAuth();
  React.useEffect(() => {
    if (role === 'admin') {
      const token = localStorage.getItem('token');
      fetch('http://localhost:4000/api/events/pending', {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then(res => res.json())
        .then(data => setPending(data.events || []));
    }
  }, [role]);

  const handleApprove = async (id: number) => {
    const token = localStorage.getItem('token');
    await fetch(`http://localhost:4000/api/events/${id}/approve`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
    });
    setPending(pending.filter(ev => ev.id !== id));
  };
  const handleReject = async (id: number) => {
    const token = localStorage.getItem('token');
    await fetch(`http://localhost:4000/api/events/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    setPending(pending.filter(ev => ev.id !== id));
  };

  if (role !== 'admin') return <div>Admin access only.</div>;
  return (
    <div>
      <h2>Pending Events</h2>
      <ul className="list-group">
        {pending.length === 0 && <li className="list-group-item">No pending events.</li>}
        {pending.map(ev => (
          <li key={ev.id} className="list-group-item d-flex justify-content-between align-items-center">
            <div>
              <strong>{ev.title}</strong> <span className="text-muted">({ev.date})</span>
              <div>{ev.description}</div>
              <div className="text-muted small">Submitted by: {ev.submittedBy}</div>
            </div>
            <div>
              <Button size="sm" variant="success" className="me-2" onClick={() => handleApprove(ev.id)}>Approve</Button>
              <Button size="sm" variant="danger" onClick={() => handleReject(ev.id)}>Reject</Button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

// Admin Skate Spots page (admin only)
const AdminSkateSpots = () => {
  const [pendingSpots, setPendingSpots] = React.useState<any[]>([]);
  const { user, role } = useAuth();

  React.useEffect(() => {
    if (role === 'admin') {
      const token = localStorage.getItem('token');
      fetch('http://localhost:4000/api/skate-spots/pending', {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then(res => res.json())
        .then(data => setPendingSpots(data.spots || []));
    }
  }, [role]);

  const handleApprove = async (id: number) => {
    const token = localStorage.getItem('token');
    await fetch(`http://localhost:4000/api/skate-spots/${id}/approve`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
    });
    setPendingSpots(pendingSpots.filter(spot => spot.id !== id));
  };

  const handleReject = async (id: number) => {
    const token = localStorage.getItem('token');
    await fetch(`http://localhost:4000/api/skate-spots/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    setPendingSpots(pendingSpots.filter(spot => spot.id !== id));
  };

  if (role !== 'admin') return <div>Admin access only.</div>;

  return (
    <div>
      <h2><i className="bi bi-geo-alt-fill me-2"></i>Pending Skate Spots</h2>
      <p className="text-muted mb-4">Review and approve new skate spot submissions from the community</p>

      {pendingSpots.length === 0 ? (
        <div className="text-center py-5">
          <i className="bi bi-check-circle text-success fs-1 mb-3"></i>
          <h5>No pending skate spots</h5>
          <p className="text-muted">All submitted spots have been reviewed!</p>
        </div>
      ) : (
        <div className="row">
          {pendingSpots.map(spot => (
            <div key={spot.id} className="col-lg-6 col-md-12 mb-4">
              <div className="card border-0 shadow-sm">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <div>
                      <h5 className="card-title mb-1">{spot.name}</h5>
                      <div className="d-flex gap-2 mb-2">
                        <span className={`badge bg-${spot.type === 'park' ? 'danger' : 'success'}`}>
                          {spot.type}
                        </span>
                        <span className={`badge bg-${spot.difficulty === 'beginner' ? 'success' : spot.difficulty === 'intermediate' ? 'warning' : 'danger'}`}>
                          {spot.difficulty}
                        </span>
                      </div>
                    </div>
                    <small className="text-muted">
                      {new Date(spot.created_at).toLocaleDateString()}
                    </small>
                  </div>

                  <p className="card-text text-muted mb-3">{spot.description}</p>

                  <div className="row mb-3">
                    <div className="col-6">
                      <small className="text-muted">Location:</small>
                      <div className="small">
                        {spot.latitude.toFixed(4)}, {spot.longitude.toFixed(4)}
                      </div>
                    </div>
                    <div className="col-6">
                      <small className="text-muted">Hours:</small>
                      <div className="small">{spot.hours || 'Not specified'}</div>
                    </div>
                  </div>

                  {spot.features && (
                    <div className="mb-3">
                      <small className="text-muted">Features:</small>
                      <div className="small">
                        {JSON.parse(spot.features).join(', ')}
                      </div>
                    </div>
                  )}

                  <div className="d-flex justify-content-between align-items-center">
                    <small className="text-muted">Submitted by: {spot.submitted_by}</small>
                    <div>
                      <Button
                        size="sm"
                        variant="success"
                        className="me-2"
                        onClick={() => handleApprove(spot.id)}
                      >
                        <i className="bi bi-check me-1"></i>Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="danger"
                        onClick={() => handleReject(spot.id)}
                      >
                        <i className="bi bi-x me-1"></i>Reject
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const Footer = () => (
  <footer className="footer-comprehensive bg-dark text-light mt-auto">
    <Container>
      <div className="row py-5">
        {/* Company Info */}
        <div className="col-lg-3 col-md-6 mb-4">
          <div className="footer-section">
            <h5 className="footer-heading mb-3">
              <i className="bi bi-lightning-charge text-warning"></i> Skate Community
            </h5>
            <p className="text-muted mb-3">
              The premier roller skating community. Connecting skaters,
              organizing events, and building friendships through our shared passion for skating.
            </p>
            <div className="footer-contact">
              <p className="mb-1">
                <i className="bi bi-geo-alt text-primary"></i> Global Community
              </p>
              <p className="mb-1">
                <i className="bi bi-envelope text-primary"></i> info@skatecommunity.com
              </p>
              <p className="mb-0">
                <i className="bi bi-telephone text-primary"></i> (555) 123-SKATE
              </p>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="col-lg-3 col-md-6 mb-4">
          <div className="footer-section">
            <h5 className="footer-heading mb-3">Quick Links</h5>
            <ul className="footer-links list-unstyled">
              <li className="mb-2">
                <Link to="/" className="footer-link">
                  <i className="bi bi-house"></i> Home
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/events" className="footer-link">
                  <i className="bi bi-calendar-event"></i> Events
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/gallery" className="footer-link">
                  <i className="bi bi-images"></i> Gallery
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/profiles" className="footer-link">
                  <i className="bi bi-people"></i> Members
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/maps" className="footer-link">
                  <i className="bi bi-map"></i> Skate Spots
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/chat" className="footer-link">
                  <i className="bi bi-chat-dots"></i> Community Chat
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Resources */}
        <div className="col-lg-3 col-md-6 mb-4">
          <div className="footer-section">
            <h5 className="footer-heading mb-3">Resources</h5>
            <ul className="footer-links list-unstyled">
              <li className="mb-2">
                <a href="#" className="footer-link">
                  <i className="bi bi-book"></i> Skating Guide
                </a>
              </li>
              <li className="mb-2">
                <a href="#" className="footer-link">
                  <i className="bi bi-shield-check"></i> Safety Tips
                </a>
              </li>
              <li className="mb-2">
                <a href="#" className="footer-link">
                  <i className="bi bi-tools"></i> Equipment Guide
                </a>
              </li>
              <li className="mb-2">
                <a href="#" className="footer-link">
                  <i className="bi bi-question-circle"></i> FAQ
                </a>
              </li>
              <li className="mb-2">
                <a href="#" className="footer-link">
                  <i className="bi bi-file-earmark-text"></i> Rules & Guidelines
                </a>
              </li>
              <li className="mb-2">
                <a href="#" className="footer-link">
                  <i className="bi bi-heart"></i> Support Us
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Social Media & Newsletter */}
        <div className="col-lg-3 col-md-6 mb-4">
          <div className="footer-section">
            <h5 className="footer-heading mb-3">Connect With Us</h5>
            <div className="social-media mb-4">
              <a href="https://facebook.com/tampablades" target="_blank" rel="noopener noreferrer" className="social-link">
                <i className="bi bi-facebook"></i>
              </a>
              <a href="https://instagram.com/tampablades" target="_blank" rel="noopener noreferrer" className="social-link">
                <i className="bi bi-instagram"></i>
              </a>
              <a href="https://twitter.com/tampablades" target="_blank" rel="noopener noreferrer" className="social-link">
                <i className="bi bi-twitter"></i>
              </a>
              <a href="https://youtube.com/tampablades" target="_blank" rel="noopener noreferrer" className="social-link">
                <i className="bi bi-youtube"></i>
              </a>
              <a href="https://tiktok.com/@tampablades" target="_blank" rel="noopener noreferrer" className="social-link">
                <i className="bi bi-tiktok"></i>
              </a>
              <a href="https://discord.gg/tampablades" target="_blank" rel="noopener noreferrer" className="social-link">
                <i className="bi bi-discord"></i>
              </a>
            </div>

            <div className="newsletter">
              <h6 className="mb-2">Stay Updated</h6>
              <p className="text-muted small mb-3">Get the latest events and skating news!</p>
              <div className="input-group">
                <input
                  type="email"
                  className="form-control form-control-sm"
                  placeholder="Your email"
                />
                <button className="btn btn-primary btn-sm" type="button">
                  <i className="bi bi-send"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="footer-bottom border-top border-secondary pt-4">
        <div className="row align-items-center">
          <div className="col-md-6">
            <p className="mb-0 text-muted">
              &copy; {new Date().getFullYear()} Tampa Blades. All rights reserved.
            </p>
          </div>
          <div className="col-md-6 text-md-end">
            <div className="footer-bottom-links">
              <a href="#" className="footer-link small me-3">Privacy Policy</a>
              <a href="#" className="footer-link small me-3">Terms of Service</a>
              <a href="#" className="footer-link small me-3">Cookie Policy</a>
              <a href="#" className="footer-link small">Accessibility</a>
            </div>
          </div>
        </div>
      </div>
    </Container>
  </footer>
);

// Auth context and provider
type UserRole = 'user' | 'admin' | 'super_admin';
type AuthContextType = {
  user: string | null;
  role: UserRole | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (username: string, password: string, email: string) => Promise<{ ok: boolean; error?: string }>;
};
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// In-memory user store for demo
const initialUsers = [
  { username: 'admin', password: 'admin123', email: 'admin@example.com', role: 'admin', verified: true },
  { username: 'user', password: 'user123', email: 'user@example.com', role: 'user', verified: true },
];

const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<string | null>(null);
  const [role, setRole] = useState<UserRole | null>(null);
  const [users, setUsers] = useState(initialUsers);

  // Check for existing token on app startup
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // Verify token with backend
      fetch('http://localhost:4000/api/me', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
        .then(response => {
          if (response.ok) {
            return response.json();
          } else {
            localStorage.removeItem('token');
            throw new Error('Invalid token');
          }
        })
        .then(data => {
          setUser(data.user.username);
          setRole(data.user.role);
        })
        .catch(() => {
          localStorage.removeItem('token');
        });
    }
  }, []);

  // Login: find user and check password
  const login = async (username: string, password: string) => {
    try {
      const response = await fetch('http://localhost:4000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Store the token and user info
        localStorage.setItem('token', data.token);
        setUser(data.user.username);
        setRole(data.user.role);
        return true;
      } else {
        return false;
      }
    } catch (error) {
      return false;
    }
  };

  // Register: add new user as normal user, require unique username/email and valid email
  const register = async (username: string, password: string, email: string) => {
    try {
      const response = await fetch('http://localhost:4000/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password, email }),
      });

      const data = await response.json();

      if (response.ok) {
        // Store the token and user info
        localStorage.setItem('token', data.token);
        setUser(data.user.username);
        setRole(data.user.role);
        return { ok: true };
      } else {
        return { ok: false, error: data.error || 'Registration failed' };
      }
    } catch (error) {
      return { ok: false, error: 'Network error. Please try again.' };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setRole(null);
  };
  return (
    <AuthContext.Provider value={{ user, role, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};

function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

// Route protection
const RequireAuth: React.FC<{ children: React.ReactNode; role?: UserRole }> = ({ children, role }) => {
  const { user, role: userRole } = useAuth();
  const location = useLocation();
  // Only protect non-home routes
  if (!user && location.pathname !== '/') {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  if (role && userRole !== role) {
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
};

const Login: React.FC = () => {
  const { login, register } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showRegister, setShowRegister] = useState(false);
  const [regUsername, setRegUsername] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regError, setRegError] = useState('');
  const [regSuccess, setRegSuccess] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await login(username, password);
    if (success) {
      navigate('/', { replace: true });
    } else {
      setError('Invalid credentials');
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegError('');
    setRegSuccess('');
    if (!regUsername || !regPassword || !regEmail) {
      setRegError('All fields are required');
      return;
    }
    const result = await register(regUsername, regPassword, regEmail);
    if (result.ok) {
      // Clear form and redirect to home
      setShowRegister(false);
      setRegUsername('');
      setRegPassword('');
      setRegEmail('');
      navigate('/', { replace: true });
    } else {
      setRegError(result.error || 'Registration failed');
    }
  };

  return (
    <div className="login-bg" style={{
      backgroundImage: `url('https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1600&q=80')`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      maxHeight: '50vh',
      paddingTop: '5vh',
      paddingBottom: '5vh',
    }}>
      <div className="login-card">
        {!showRegister ? (
          <>
            <h2 className="mb-4 text-center">Login</h2>
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3" controlId="formUsername">
                <Form.Label>Username</Form.Label>
                <Form.Control type="text" value={username} onChange={e => setUsername(e.target.value)} required />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" value={password} onChange={e => setPassword(e.target.value)} required />
              </Form.Group>
              {error && <div className="text-danger mb-2">{error}</div>}
              <Button type="submit" variant="primary" className="w-100 mb-2">Login</Button>
            </Form>
            <Button variant="link" className="w-100" onClick={() => setShowRegister(true)}>Create an account</Button>
          </>
        ) : (
          <>
            <Button variant="secondary" className="w-100 mb-3" onClick={() => setShowRegister(false)}>
              ← Back
            </Button>
            <h2 className="mb-4 text-center">Create Account</h2>
            <Form onSubmit={handleRegister}>
              <Form.Group className="mb-3" controlId="formRegUsername">
                <Form.Label>Username</Form.Label>
                <Form.Control type="text" value={regUsername} onChange={e => setRegUsername(e.target.value)} required />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formRegEmail">
                <Form.Label>Email</Form.Label>
                <Form.Control type="email" value={regEmail} onChange={e => setRegEmail(e.target.value)} required />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formRegPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" value={regPassword} onChange={e => setRegPassword(e.target.value)} required />
              </Form.Group>
              {regError && <div className="text-danger mb-2">{regError}</div>}
              {regSuccess && <div className="text-success mb-2">{regSuccess}</div>}
              <Button type="submit" variant="primary" className="w-100 mb-2">Register</Button>
            </Form>
          </>
        )}
      </div>
    </div>
  );
};

function AppCarousel() {
  return (
    <RequireAuth>
      <div style={{ width: '100vw', maxWidth: '100%', height: '50vh', overflow: 'hidden', marginBottom: 0 }}>
        <Carousel interval={15000} controls indicators fade style={{ height: '100%' }}>
          <Carousel.Item>
            <img
              className="d-block w-100"
              src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1600&q=80"
              alt="Nature Lake"
              style={{ height: '50vh', objectFit: 'cover' }}
            />
            <Carousel.Caption>
              <h3>Nature Lake</h3>
              <p>Beautiful lake surrounded by mountains.</p>
            </Carousel.Caption>
          </Carousel.Item>
          <Carousel.Item>
            <img
              className="d-block w-100"
              src="https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=1600&q=80"
              alt="Forest Path"
              style={{ height: '50vh', objectFit: 'cover' }}
            />
            <Carousel.Caption>
              <h3>Forest Path</h3>
              <p>A peaceful path through the forest.</p>
            </Carousel.Caption>
          </Carousel.Item>
          <Carousel.Item>
            <img
              className="d-block w-100"
              src="https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=1600&q=80"
              alt="City Skyline"
              style={{ height: '50vh', objectFit: 'cover' }}
            />
            <Carousel.Caption>
              <h3>City Skyline</h3>
              <p>Modern city skyline at sunset.</p>
            </Carousel.Caption>
          </Carousel.Item>
          <Carousel.Item>
            <img
              className="d-block w-100"
              src="https://images.unsplash.com/photo-1465101178521-c1a9136a3b99?auto=format&fit=crop&w=1600&q=80"
              alt="Mountain Road"
              style={{ height: '50vh', objectFit: 'cover' }}
            />
            <Carousel.Caption>
              <h3>Mountain Road</h3>
              <p>Winding road through the mountains.</p>
            </Carousel.Caption>
          </Carousel.Item>
          <Carousel.Item>
            <img
              className="d-block w-100"
              src="https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1600&q=80"
              alt="Desert Dunes"
              style={{ height: '50vh', objectFit: 'cover' }}
            />
            <Carousel.Caption>
              <h3>Desert Dunes</h3>
              <p>Golden sand dunes under a blue sky.</p>
            </Carousel.Caption>
          </Carousel.Item>
          <Carousel.Item>
            <img
              className="d-block w-100"
              src="https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=1600&q=80"
              alt="Misty Forest"
              style={{ height: '50vh', objectFit: 'cover' }}
            />
            <Carousel.Caption>
              <h3>Misty Forest</h3>
              <p>Early morning mist in a dense forest.</p>
            </Carousel.Caption>
          </Carousel.Item>
          <Carousel.Item>
            <img
              className="d-block w-100"
              src="https://images.unsplash.com/photo-1465101053361-763ab02bced9?auto=format&fit=crop&w=1600&q=80"
              alt="Snowy Peaks"
              style={{ height: '50vh', objectFit: 'cover' }}
            />
            <Carousel.Caption>
              <h3>Snowy Peaks</h3>
              <p>Snow-covered mountains under a clear sky.</p>
            </Carousel.Caption>
          </Carousel.Item>
          <Carousel.Item>
            <img
              className="d-block w-100"
              src="https://images.unsplash.com/photo-1465101178521-c1a9136a3b99?auto=format&fit=crop&w=1600&q=80"
              alt="Country Road"
              style={{ height: '50vh', objectFit: 'cover' }}
            />
            <Carousel.Caption>
              <h3>Country Road</h3>
              <p>A quiet road through the countryside.</p>
            </Carousel.Caption>
          </Carousel.Item>
          <Carousel.Item>
            <img
              className="d-block w-100"
              src="https://images.unsplash.com/photo-1465101060329-697a5aa0a7a6?auto=format&fit=crop&w=1600&q=80"
              alt="Ocean View"
              style={{ height: '50vh', objectFit: 'cover' }}
            />
            <Carousel.Caption>
              <h3>Ocean View</h3>
              <p>Waves crashing on a rocky shore.</p>
            </Carousel.Caption>
          </Carousel.Item>
        </Carousel>
      </div>
    </RequireAuth>
  );
}

// Weather Widget (Tampa)
type WeatherData = {
  weather: { icon: string; main: string }[];
  main: { temp: number };
};
// IMPORTANT: Set your OpenWeatherMap API key in a .env file as REACT_APP_OPENWEATHER_API_KEY
function WeatherWidget() {
  const [weather, setWeather] = React.useState<WeatherData | null>(null);
  useEffect(() => {
    const apiKey = process.env.REACT_APP_OPENWEATHER_API_KEY;
    if (!apiKey) return;
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=Tampa,FL,US&appid=${apiKey}&units=imperial`)
      .then(res => res.json())
      .then(data => setWeather(data));
  }, []);
  if (!weather || !weather.weather) return null;
  return (
    <div className="weather-widget" style={{ margin: '0 auto', maxWidth: 300, marginBottom: 16 }}>
      <img src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}.png`} alt="weather" style={{ width: 28, height: 28 }} />
      {Math.round(weather.main.temp)}°F {weather.weather[0].main}
    </div>
  );
}

// User Dropdown Component
const UserDropdown: React.FC = () => {
  const { user, logout, role } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    localStorage.removeItem('token');
    navigate('/');
  };

  const getInitials = (username: string) => {
    return username.substring(0, 2).toUpperCase();
  };

  return (
    <Dropdown align="end">
      <Dropdown.Toggle
        variant="outline-light"
        id="user-dropdown"
        title={`${user} - Click for account options`}
        style={{
          borderRadius: '50%',
          width: '40px',
          height: '40px',
          padding: '0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '14px',
          fontWeight: 'bold',
          border: '2px solid rgba(255,255,255,0.3)',
          backgroundColor: 'rgba(255,255,255,0.1)',
          color: 'white',
          cursor: 'pointer'
        }}
      >
        {getInitials(user || '')}
      </Dropdown.Toggle>

      <Dropdown.Menu style={{ minWidth: '200px', marginTop: '8px' }}>
        <Dropdown.Header>
          <div style={{ fontWeight: 'bold' }}>{user}</div>
          <div style={{ fontSize: '12px', color: '#6c757d' }}>
            {role === 'admin' ? 'Administrator' : 'User'}
          </div>
        </Dropdown.Header>
        <Dropdown.Divider />
        <Dropdown.Item as={Link} to="/profile">
          <i className="bi bi-person" style={{ marginRight: '8px' }}></i>
          My Profile
        </Dropdown.Item>
        <Dropdown.Item as={Link} to="/messages">
          <i className="bi bi-chat-dots" style={{ marginRight: '8px' }}></i>
          Messages
        </Dropdown.Item>
        <Dropdown.Item as={Link} to="/settings">
          <i className="bi bi-gear" style={{ marginRight: '8px' }}></i>
          Settings
        </Dropdown.Item>
        {role === 'admin' && (
          <Dropdown.Item as={Link} to="/admin">
            <i className="bi bi-shield" style={{ marginRight: '8px' }}></i>
            Admin Panel
          </Dropdown.Item>
        )}
        {role === 'admin' && (
          <Dropdown.Item as={Link} to="/admin-skate-spots">
            <i className="bi bi-geo-alt" style={{ marginRight: '8px' }}></i>
            Manage Skate Spots
          </Dropdown.Item>
        )}
        <Dropdown.Divider />
        <Dropdown.Item onClick={handleLogout} style={{ color: '#dc3545' }}>
          <i className="bi bi-box-arrow-right" style={{ marginRight: '8px' }}></i>
          Logout
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
};

function AppLayout({ darkMode, setDarkMode }: { darkMode: boolean; setDarkMode: (mode: boolean) => void }) {
  const location = useLocation();
  const currentPath = location.pathname;
  const { user, role } = useAuth();
  return (
    <>
      <Navbar bg="primary" variant="dark" expand="lg">
        <Container>
          <Navbar.Brand as={Link} to="/">
            <img src={logo} alt="Logo" /> Skate Community
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              {currentPath !== '/' && <Nav.Link as={Link} to="/">Home</Nav.Link>}
              <Nav.Link as={Link} to="/events">Events</Nav.Link>
              {user && currentPath !== '/gallery' && <Nav.Link as={Link} to="/gallery">Gallery</Nav.Link>}
              {user && currentPath !== '/chat' && <Nav.Link as={Link} to="/chat">Chat</Nav.Link>}
              {user && currentPath !== '/profiles' && <Nav.Link as={Link} to="/profiles">Profiles</Nav.Link>}
              {user && currentPath !== '/maps' && <Nav.Link as={Link} to="/maps">Maps</Nav.Link>}
              {role === 'admin' && <Nav.Link as={Link} to="/admin-events">Admin Events</Nav.Link>}
              {role === 'admin' && <Nav.Link as={Link} to="/admin-skate-spots">Admin Skate Spots</Nav.Link>}
              {!user && currentPath !== '/login' && <Nav.Link as={Link} to="/login">Login</Nav.Link>}
            </Nav>
            <Nav className="ms-auto">
              <Button
                variant="outline-primary"
                size="sm"
                onClick={() => setDarkMode(!darkMode)}
                className="me-2 theme-toggle-btn"
                title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
              >
                {darkMode ? (
                  <i className="bi bi-sun-fill text-warning"></i>
                ) : (
                  <i className="bi bi-moon-fill text-primary"></i>
                )}
              </Button>
            </Nav>
            {user && <UserDropdown />}
          </Navbar.Collapse>
        </Container>
      </Navbar>
      {currentPath === '/' && <AppCarousel />}
      <Container className="flex-grow-1 py-4">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/events" element={<Events />} />
          <Route path="/admin-events" element={<RequireAuth role="admin"><AdminEvents /></RequireAuth>} />
          <Route path="/admin-skate-spots" element={<RequireAuth role="admin"><AdminSkateSpots /></RequireAuth>} />
          <Route path="/login" element={<Login />} />
          <Route path="/gallery" element={<RequireAuth><Gallery /></RequireAuth>} />
          <Route path="/chat" element={<RequireAuth><Chat /></RequireAuth>} />
          <Route path="/profiles" element={<RequireAuth><Profiles /></RequireAuth>} />
          <Route path="/maps" element={<RequireAuth><Maps /></RequireAuth>} />
          <Route path="/profile" element={<RequireAuth><Profile /></RequireAuth>} />
          <Route path="/settings" element={<RequireAuth><Settings darkMode={darkMode} setDarkMode={setDarkMode} /></RequireAuth>} />
          <Route path="/messages" element={<RequireAuth><Messages /></RequireAuth>} />
          <Route path="/admin" element={<RequireAuth role="admin"><Admin /></RequireAuth>} />
        </Routes>
      </Container>
      <Footer />
    </>
  );
}

function App() {
  const [darkMode, setDarkMode] = React.useState<boolean>(() => {
    // Check localStorage for saved preference
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : false;
  });

  // Apply dark mode to body
  React.useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
    // Save preference to localStorage
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);

  return (
    <AuthProvider>
      <Router>
        {/* Skate-themed Background Elements */}
        <div className="skate-pattern"></div>
        <div className="skate-grid"></div>
        <div className="skate-ramp"></div>

        {/* Floating Inline Skating Elements */}
        <div className="skate-element">⛸️</div>
        <div className="skate-element">⚡</div>
        <div className="skate-element">🔥</div>
        <div className="skate-element">💨</div>
        <div className="skate-element">🎯</div>
        <div className="skate-element">🏆</div>

        {/* Skate Park Elements */}
        <div className="skate-park-element"></div>
        <div className="skate-park-element"></div>
        <div className="skate-park-element"></div>
        <div className="skate-park-element"></div>

        <AppLayout darkMode={darkMode} setDarkMode={setDarkMode} />
      </Router>
    </AuthProvider>
  );
}

export default App;
