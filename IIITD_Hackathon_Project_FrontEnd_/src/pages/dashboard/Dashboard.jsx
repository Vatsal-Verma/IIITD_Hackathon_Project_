import { useEffect, useState } from "react";
import { Container, Alert, Spinner } from "react-bootstrap";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import './Dashboard.css';

function PatientDashboard() {
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch all patients' data
    const fetchPatientsData = async () => {
        try {
            const response = await fetch("http://localhost:8080/api/employees", {
                headers: { "Content-Type": "application/json" },
            });
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.json();
            if (!Array.isArray(data)) {
                throw new Error("Expected an array of patients");
            }
            setPatients(data);
            setLoading(false);
        } catch (error) {
            console.error("Fetch error:", error);
            setError(`Error fetching patient data: ${error.message}`);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPatientsData();
        const interval = setInterval(fetchPatientsData, 5000);
        return () => clearInterval(interval);
    }, []);

    if (loading) {
        return (
            <div className="dashboard-loading">
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <p>Loading patient data...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="dashboard-error">
                <div className="error-container">
                    <div className="error-icon">⚠</div>
                    <h3>Error Loading Data</h3>
                    <p>{error}</p>
                    <button onClick={fetchPatientsData} className="retry-btn">
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    // Find the most recent patient (e.g., highest ID)
    const latestPatient = patients.length > 0
        ? patients.reduce((latest, current) =>
              (current.id > latest.id ? current : latest), patients[0])
        : null;

    // Define field-value pairs for the latest patient
    const patientFields = latestPatient
        ? [
              { field: "Patient ID", value: `P-${latestPatient.id.toString().padStart(4, '0')}`, icon: "🆔" },
              { field: "Full Name", value: latestPatient.name || "N/A", icon: "👤" },
              { field: "Age", value: latestPatient.age || "N/A", icon: "🎂" },
              { field: "Gender", value: latestPatient.gender || "N/A", icon: "⚧" },
              { field: "Email Address", value: latestPatient.email || "N/A", icon: "📧" },
              { field: "Phone Number", value: latestPatient.phone || "N/A", icon: "📞" },
              { field: "Medical Symptoms", value: latestPatient.department || "N/A", icon: "🏥" },
              { field: "Application Date", value: latestPatient.date || "N/A", icon: "📅" },
              {
                  field: "Appointment Status",
                  value: latestPatient.status || "Pending",
                  icon: latestPatient.status === "Approved" ? "✅" : latestPatient.status === "Rejected" ? "❌" : "⏳",
                  className:
                      latestPatient.status === "Approved"
                          ? "status-approved"
                          : latestPatient.status === "Rejected"
                          ? "status-rejected"
                          : "status-pending",
              },
              ...(latestPatient.emailSent
                  ? [{
                        field: "Email Notification",
                        value: "Check your email for appointment details",
                        icon: "📬",
                        className: "notification-sent"
                    }]
                  : [])
          ]
        : [];

    const getStatusBadge = (status) => {
        switch(status) {
            case "Approved":
                return <span className="status-badge approved">Approved</span>;
            case "Rejected":
                return <span className="status-badge rejected">Rejected</span>;
            default:
                return <span className="status-badge pending">Pending</span>;
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
                        <h1>Patient Dashboard</h1>
                        <p>View your appointment details and status</p>
                    </div>
                </div>
            </div>

            <div className="dashboard-content">
                {patientFields.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-icon">📋</div>
                        <h3>No Patient Data Found</h3>
                        <p>No appointment records are available at the moment.</p>
                    </div>
                ) : (
                    <div className="patient-card">
                        <div className="card-header">
                            <h2>Latest Appointment Details</h2>
                            <div className="patient-id">
                                Patient ID: {latestPatient ? `P-${latestPatient.id.toString().padStart(4, '0')}` : 'N/A'}
                            </div>
                        </div>
                        
                        <div className="patient-info-grid">
                            {patientFields.map((item, index) => (
                                <div key={index} className={`info-item ${item.className || ''}`}>
                                    <div className="info-label">
                                        <span className="field-icon">{item.icon}</span>
                                        {item.field}
                                    </div>
                                    <div className="info-value">
                                        {item.field === "Appointment Status" ? 
                                            getStatusBadge(item.value) : 
                                            <span className={item.className || ""}>{item.value}</span>
                                        }
                                    </div>
                                </div>
                            ))}
                        </div>

                        {latestPatient && latestPatient.status === "Approved" && (
                            <div className="approval-notice">
                                <div className="notice-icon">📬</div>
                                <div className="notice-content">
                                    <h4>Appointment Confirmed!</h4>
                                    <p>Please check your email for detailed appointment information and instructions.</p>
                                </div>
                            </div>
                        )}

                        {latestPatient && latestPatient.status === "Pending" && (
                            <div className="pending-notice">
                                <div className="notice-icon">⏳</div>
                                <div className="notice-content">
                                    <h4>Application Under Review</h4>
                                    <p>Your appointment request is being reviewed. You will receive an email notification once processed.</p>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

export default PatientDashboard;