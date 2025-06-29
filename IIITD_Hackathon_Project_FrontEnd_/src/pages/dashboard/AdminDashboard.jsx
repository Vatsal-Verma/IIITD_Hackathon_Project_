import { useEffect, useState } from "react";
import { Container, Table, Button, Dropdown, Alert, Modal } from "react-bootstrap";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import './Dashboard.css';

// Fallback data for when API is unavailable
const fallbackPatients = [
    {
        id: 1,
        name: "John Doe",
        age: 35,
        gender: "Male",
        email: "john.doe@email.com",
        phone: "+1-555-0123",
        department: "Patient reports persistent headaches and fatigue for the past 2 weeks. Also experiencing difficulty sleeping and mild anxiety.",
        date: "2024-01-15",
        status: "Pending",
        emailSent: false
    },
    {
        id: 2,
        name: "Jane Smith",
        age: 28,
        gender: "Female",
        email: "jane.smith@email.com",
        phone: "+1-555-0124",
        department: "Experiencing chest pain and shortness of breath during physical activity. Symptoms worsen with stress.",
        date: "2024-01-14",
        status: "Approved",
        emailSent: true
    },
    {
        id: 3,
        name: "Mike Johnson",
        age: 42,
        gender: "Male",
        email: "mike.johnson@email.com",
        phone: "+1-555-0125",
        department: "Lower back pain that radiates to the legs. Difficulty standing for long periods. Pain increases with movement.",
        date: "2024-01-13",
        status: "wait-list",
        emailSent: false
    }
];

function DoctorDashboard() {
    const [patients, setPatients] = useState([]);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [selectedSymptoms, setSelectedSymptoms] = useState("");
    const [loading, setLoading] = useState(true);
    const [isOfflineMode, setIsOfflineMode] = useState(false);

    const handleShowModal = (symptoms) => {
        setSelectedSymptoms(symptoms);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedSymptoms("");
    };

    useEffect(() => {
        const fetchPatients = async () => {
            setLoading(true);
            setError(null);
            setIsOfflineMode(false);
            
            try {
                const response = await fetch("http://localhost:8080/api/employees", {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' },
                    signal: AbortSignal.timeout(5000) // 5 second timeout
                });
                
                if (!response.ok) throw new Error("Failed to fetch patient data");
                const data = await response.json();
                setPatients(data);
            } catch (error) {
                console.error('API Error:', error);
                // Use fallback data when API is unavailable
                setPatients(fallbackPatients);
                setIsOfflineMode(true);
                setError("Note: Using demo data due to connection issues. For real-time data, please check your server connection.");
            } finally {
                setLoading(false);
            }
        };
        fetchPatients();
    }, []);

    const handleStatusChange = async (id, newStatus) => {
        try {
            if (isOfflineMode) {
                // Update local state only in offline mode
                setPatients((prev) =>
                    prev.map((patient) =>
                        patient.id === id ? { ...patient, status: newStatus } : patient
                    )
                );
                return;
            }

            const response = await fetch(`http://localhost:8080/api/employee/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: newStatus }),
            });
            if (!response.ok) throw new Error("Failed to update status");
            setPatients((prev) =>
                prev.map((patient) =>
                    patient.id === id ? { ...patient, status: newStatus } : patient
                )
            );
        } catch (error) {
            setError("Error updating status: " + error.message);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this patient?")) {
            return;
        }

        try {
            if (isOfflineMode) {
                // Update local state only in offline mode
                setPatients((prev) => prev.filter((patient) => patient.id !== id));
                return;
            }

            const response = await fetch(`http://localhost:8080/api/employee/${id}`, {
                method: "DELETE",
            });
            if (!response.ok) throw new Error("Failed to delete patient");
            setPatients((prev) => prev.filter((patient) => patient.id !== id));
        } catch (error) {
            setError("Error deleting patient: " + error.message);
        }
    };

    const handleSendEmail = async (id, email) => {
        try {
            if (isOfflineMode) {
                // Simulate email sending in offline mode
                setPatients((prev) =>
                    prev.map((patient) =>
                        patient.id === id ? { ...patient, emailSent: true } : patient
                    )
                );
                alert("Email sent successfully (demo mode)");
                return;
            }

            const emailResponse = await fetch(`http://localhost:8080/api/employee/${id}/send-email`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });
            if (!emailResponse.ok) {
                const errorData = await emailResponse.text();
                throw new Error(errorData || "Failed to send email");
            }

            const updateResponse = await fetch(`http://localhost:8080/api/employee/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ emailSent: true }),
            });
            if (!updateResponse.ok) throw new Error("Failed to update email sent status");

            setPatients((prev) =>
                prev.map((patient) =>
                    patient.id === id ? { ...patient, emailSent: true } : patient
                )
            );

            setError(null);
            alert("Email sent successfully");
        } catch (error) {
            setError("Error sending email: " + error.message);
        }
    };

    const getStatusVariant = (status) => {
        switch (status) {
            case "Approved": return "success";
            case "Rejected": return "danger";
            case "wait-list": return "info";
            default: return "warning";
        }
    };

    return (
        <div className="dashboard-container">
            <div className="dashboard-header">
                <div className="header-content">
                    <div className="header-icon">
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM16.36 14.83C16.36 15.33 15.96 15.73 15.46 15.73H8.54C8.04 15.73 7.64 15.33 7.64 14.83V9.17C7.64 8.67 8.04 8.27 8.54 8.27H15.46C15.96 8.27 16.36 8.67 16.36 9.17V14.83Z" fill="currentColor"/>
                        </svg>
                    </div>
                    <div className="header-text">
                        <h1>Doctor Admin Dashboard</h1>
                        <p>Manage patient appointments and medical records</p>
                    </div>
                </div>
            </div>

            <div className="dashboard-content">
                {isOfflineMode && (
                    <Alert variant="warning" className="mb-4">
                        <Alert.Heading>Demo Mode</Alert.Heading>
                        <p>
                            Currently using demo data due to server connection issues. 
                            All changes are temporary and will reset on page refresh.
                        </p>
                    </Alert>
                )}

                {error && <Alert variant="danger" className="mb-4">{error}</Alert>}

                {loading ? (
                    <div className="dashboard-loading">
                        <div className="loading-container">
                            <div className="loading-spinner"></div>
                            <p>Loading patient data...</p>
                        </div>
                    </div>
                ) : (
                    <div className="patient-card">
                        <div className="card-header">
                            <h2>Patient Management</h2>
                            <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                                <span style={{ background: 'rgba(255, 255, 255, 0.2)', padding: '8px 16px', borderRadius: '20px', fontSize: '0.9rem' }}>
                                    Total: {patients.length}
                                </span>
                                <span style={{ background: 'rgba(255, 255, 255, 0.2)', padding: '8px 16px', borderRadius: '20px', fontSize: '0.9rem' }}>
                                    Pending: {patients.filter(p => p.status === 'Pending').length}
                                </span>
                                <span style={{ background: 'rgba(255, 255, 255, 0.2)', padding: '8px 16px', borderRadius: '20px', fontSize: '0.9rem' }}>
                                    Approved: {patients.filter(p => p.status === 'Approved').length}
                                </span>
                            </div>
                        </div>

                        <div className="patient-info-grid">
                            {patients.length === 0 ? (
                                <div className="empty-state">
                                    <div className="empty-icon">📋</div>
                                    <h3>No Patients Found</h3>
                                    <p>No patient records are currently available.</p>
                                </div>
                            ) : (
                                patients.map((patient) => (
                                    <div key={patient.id} className="info-item">
                                        <div className="info-label">
                                            <span className="field-icon">👤</span>
                                            Patient ID
                                        </div>
                                        <div className="info-value">P-{patient.id}</div>
                                        
                                        <div className="info-label">
                                            <span className="field-icon">📝</span>
                                            Name
                                        </div>
                                        <div className="info-value">{patient.name}</div>
                                        
                                        <div className="info-label">
                                            <span className="field-icon">🎂</span>
                                            Age
                                        </div>
                                        <div className="info-value">{patient.age} years</div>
                                        
                                        <div className="info-label">
                                            <span className="field-icon">⚧</span>
                                            Gender
                                        </div>
                                        <div className="info-value">{patient.gender}</div>
                                        
                                        <div className="info-label">
                                            <span className="field-icon">📧</span>
                                            Email
                                        </div>
                                        <div className="info-value">{patient.email}</div>
                                        
                                        <div className="info-label">
                                            <span className="field-icon">📞</span>
                                            Phone
                                        </div>
                                        <div className="info-value">{patient.phone}</div>
                                        
                                        <div className="info-label">
                                            <span className="field-icon">📅</span>
                                            Application Date
                                        </div>
                                        <div className="info-value">{patient.date}</div>
                                        
                                        <div className="info-label">
                                            <span className="field-icon">🏥</span>
                                            Status
                                        </div>
                                        <div className="info-value">
                                            <span className={`status-badge ${patient.status?.toLowerCase()}`}>
                                                {patient.status || "Pending"}
                                            </span>
                                        </div>
                                        
                                        <div className="info-label">
                                            <span className="field-icon">📋</span>
                                            Symptoms
                                        </div>
                                        <div className="info-value">
                                            <button
                                                style={{ 
                                                    background: 'none', 
                                                    border: 'none', 
                                                    color: '#667eea', 
                                                    textDecoration: 'underline',
                                                    cursor: 'pointer',
                                                    padding: 0
                                                }}
                                                onClick={() => handleShowModal(patient.department)}
                                            >
                                                Read Symptoms
                                            </button>
                                        </div>
                                        
                                        <div className="info-label">
                                            <span className="field-icon">⚙️</span>
                                            Actions
                                        </div>
                                        <div className="info-value">
                                            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                                <button
                                                    style={{
                                                        background: '#667eea',
                                                        color: 'white',
                                                        border: 'none',
                                                        padding: '6px 12px',
                                                        borderRadius: '6px',
                                                        fontSize: '0.85rem',
                                                        cursor: patient.emailSent ? 'not-allowed' : 'pointer',
                                                        opacity: patient.emailSent ? 0.6 : 1
                                                    }}
                                                    onClick={() => handleSendEmail(patient.id, patient.email)}
                                                    disabled={patient.emailSent}
                                                >
                                                    {patient.emailSent ? 'Email Sent' : 'Send Email'}
                                                </button>
                                                <button
                                                    style={{
                                                        background: '#e53e3e',
                                                        color: 'white',
                                                        border: 'none',
                                                        padding: '6px 12px',
                                                        borderRadius: '6px',
                                                        fontSize: '0.85rem',
                                                        cursor: 'pointer'
                                                    }}
                                                    onClick={() => handleDelete(patient.id)}
                                                >
                                                    Delete
                                                </button>
                                                <Dropdown>
                                                    <Dropdown.Toggle
                                                        variant={getStatusVariant(patient.status)}
                                                        size="sm"
                                                    >
                                                        Change Status
                                                    </Dropdown.Toggle>
                                                    <Dropdown.Menu>
                                                        {["Approved", "Rejected", "Pending", "wait-list"].map((status) => (
                                                            <Dropdown.Item
                                                                key={status}
                                                                onClick={() => handleStatusChange(patient.id, status)}
                                                            >
                                                                {status}
                                                            </Dropdown.Item>
                                                        ))}
                                                    </Dropdown.Menu>
                                                </Dropdown>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                )}

                <div style={{ textAlign: 'center', marginTop: '2rem' }}>
                    <Button
                        variant="primary"
                        size="lg"
                        href="https://chat.gise.at/#Doctor"
                        target="_blank"
                        style={{
                            background: 'linear-gradient(135deg, #667eea, #764ba2)',
                            border: 'none',
                            padding: '15px 30px',
                            borderRadius: '12px',
                            boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)'
                        }}
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: '8px' }}>
                            <path d="M17 10.5V7C17 4.24 14.76 2 12 2C9.24 2 7 4.24 7 7V10.5C5.9 10.5 5 11.4 5 12.5V19.5C5 20.6 5.9 21.5 7 21.5H17C18.1 21.5 19 20.6 19 19.5V12.5C19 11.4 18.1 10.5 17 10.5ZM12 17C13.1 17 14 16.1 14 15C14 13.9 13.1 13 12 13C10.9 13 10 13.9 10 15C10 16.1 10.9 17 12 17Z" fill="currentColor"/>
                        </svg>
                        Join Meeting
                    </Button>
                </div>
            </div>

            <Modal show={showModal} onHide={handleCloseModal} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Patient Symptoms</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div style={{ background: '#f7fafc', padding: '20px', borderRadius: '10px', borderLeft: '4px solid #667eea' }}>
                        <p style={{ margin: 0, lineHeight: 1.6 }}>{selectedSymptoms || "No symptoms provided"}</p>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default DoctorDashboard;