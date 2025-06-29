import "./PostUser.css"
import { useState } from "react"
import Button from "react-bootstrap/Button"
import { useNavigate } from "react-router-dom"

function PostUser() {
    const [formData, setFormData] = useState({
        name: "",
        age: "",
        gender: "",
        email: "",
        phone: "",
        department: ""
    })

    const [errors, setErrors] = useState({
        name: "",
        age: "",
        gender: "",
        email: "",
        phone: "",
        department: ""
    })

    const navigate = useNavigate();

    const validateForm = () => {
        let isValid = true;
        const newErrors = {
            name: "",
            age: "",
            gender: "",
            email: "",
            phone: "",
            department: ""
        };

        // Name validation
        if (!formData.name.trim()) {
            newErrors.name = "Name is required";
            isValid = false;
        } else if (formData.name.length < 2) {
            newErrors.name = "Name must be at least 2 characters";
            isValid = false;
        }

        // Age validation
        if (!formData.age) {
            newErrors.age = "Age is required";
            isValid = false;
        } else if (isNaN(formData.age) || formData.age < 1 || formData.age > 150) {
            newErrors.age = "Age must be a number between 1 and 150";
            isValid = false;
        }

        // Gender validation
        if (!formData.gender.trim()) {
            newErrors.gender = "Gender is required";
            isValid = false;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!formData.email) {
            newErrors.email = "Email is required";
            isValid = false;
        } else if (!emailRegex.test(formData.email)) {
            newErrors.email = "Invalid email format";
            isValid = false;
        }

        // Phone validation
        const phoneRegex = /^\+?[\d\s-]{10,}$/;
        if (!formData.phone) {
            newErrors.phone = "Phone number is required";
            isValid = false;
        } else if (!phoneRegex.test(formData.phone)) {
            newErrors.phone = "Invalid phone number format";
            isValid = false;
        }

        // Department/Symptoms validation
        if (!formData.department.trim()) {
            newErrors.department = "Symptoms are required";
            isValid = false;
        } else if (formData.department.length < 3) {
            newErrors.department = "Symptoms must be at least 3 characters";
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    function handleInputChange(event) {
        const { name, value } = event.target;
        setFormData({
            ...formData,
            [name]: value,
        });
        // Clear error when user starts typing
        setErrors({
            ...errors,
            [name]: ""
        });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (validateForm()) {
            try {
                const response = await fetch("http://localhost:8080/api/employee", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(formData)
                });

                const data = await response.json();
                console.log("Employee created: ", data);
                navigate("/dashboard");
            } catch (error) {
                console.log("Error creating Employee", error.message);
            }
        }
    };

    return (
        <div className="appointment-container">
            <div className="appointment-card">
                <div className="appointment-header">
                    <div className="header-icon">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM16.36 14.83C16.36 15.33 15.96 15.73 15.46 15.73H8.54C8.04 15.73 7.64 15.33 7.64 14.83V9.17C7.64 8.67 8.04 8.27 8.54 8.27H15.46C15.96 8.27 16.36 8.67 16.36 9.17V14.83Z" fill="currentColor"/>
                        </svg>
                    </div>
                    <h1>Book Your Appointment</h1>
                    <p>Please fill in your details to schedule your medical appointment</p>
                </div>

                <form onSubmit={handleSubmit} className="appointment-form">
                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="name">Full Name</label>
                            <div className="input-wrapper">
                                <svg className="input-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z" fill="currentColor"/>
                                </svg>
                                <input
                                    id="name"
                                    type="text"
                                    name="name"
                                    placeholder="Enter your full name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    className={errors.name ? "form-input error" : "form-input"}
                                />
                            </div>
                            {errors.name && <div className="error-message">{errors.name}</div>}
                        </div>

                        <div className="form-group">
                            <label htmlFor="age">Age</label>
                            <div className="input-wrapper">
                                <svg className="input-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 6C13.1 6 14 6.9 14 8C14 9.1 13.1 10 12 10C10.9 10 10 9.1 10 8C10 6.9 10.9 6 12 6ZM12 20C9.33 20 7 17.67 7 15H17C17 17.67 14.67 20 12 20Z" fill="currentColor"/>
                                </svg>
                                <input
                                    id="age"
                                    type="number"
                                    name="age"
                                    placeholder="Enter your age"
                                    value={formData.age}
                                    onChange={handleInputChange}
                                    className={errors.age ? "form-input error" : "form-input"}
                                />
                            </div>
                            {errors.age && <div className="error-message">{errors.age}</div>}
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="gender">Gender</label>
                            <div className="input-wrapper">
                                <svg className="input-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 6C13.1 6 14 6.9 14 8C14 9.1 13.1 10 12 10C10.9 10 10 9.1 10 8C10 6.9 10.9 6 12 6ZM12 20C9.33 20 7 17.67 7 15H17C17 17.67 14.67 20 12 20Z" fill="currentColor"/>
                                </svg>
                                <select
                                    id="gender"
                                    name="gender"
                                    value={formData.gender}
                                    onChange={handleInputChange}
                                    className={errors.gender ? "form-input error" : "form-input"}
                                >
                                    <option value="">Select gender</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                            {errors.gender && <div className="error-message">{errors.gender}</div>}
                        </div>

                        <div className="form-group">
                            <label htmlFor="phone">Phone Number</label>
                            <div className="input-wrapper">
                                <svg className="input-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M6.62 10.79C8.06 13.62 10.38 15.94 13.21 17.38L15.41 15.18C15.69 14.9 16.08 14.82 16.43 14.93C17.55 15.3 18.75 15.5 20 15.5C20.55 15.5 21 15.95 21 16.5V20C21 20.55 20.55 21 20 21C10.61 21 3 13.39 3 4C3 3.45 3.45 3 4 3H7.5C8.05 3 8.5 3.45 8.5 4C8.5 5.25 8.7 6.45 9.07 7.57C9.18 7.92 9.1 8.31 8.82 8.59L6.62 10.79Z" fill="currentColor"/>
                                </svg>
                                <input
                                    id="phone"
                                    type="tel"
                                    name="phone"
                                    placeholder="Enter your phone number"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    className={errors.phone ? "form-input error" : "form-input"}
                                />
                            </div>
                            {errors.phone && <div className="error-message">{errors.phone}</div>}
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="email">Email Address</label>
                        <div className="input-wrapper">
                            <svg className="input-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M20 4H4C2.9 4 2 4.9 2 6V18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6C22 4.9 21.1 4 20 4ZM20 8L12 13L4 8V6L12 11L20 6V8Z" fill="currentColor"/>
                            </svg>
                            <input
                                id="email"
                                type="email"
                                name="email"
                                placeholder="Enter your email address"
                                value={formData.email}
                                onChange={handleInputChange}
                                className={errors.email ? "form-input error" : "form-input"}
                            />
                        </div>
                        {errors.email && <div className="error-message">{errors.email}</div>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="department">Symptoms/Medical Concerns</label>
                        <div className="input-wrapper">
                            <svg className="input-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM19 19H5V5H19V19ZM17 13H7V11H17V13ZM13 17H7V15H13V17ZM7 7V9H17V7H7Z" fill="currentColor"/>
                            </svg>
                            <textarea
                                id="department"
                                name="department"
                                placeholder="Describe your symptoms or medical concerns"
                                value={formData.department}
                                onChange={handleInputChange}
                                className={errors.department ? "form-input error" : "form-input"}
                                rows="3"
                            />
                        </div>
                        {errors.department && <div className="error-message">{errors.department}</div>}
                    </div>

                    <Button variant="primary" type="submit" className="submit-btn">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M9 16.17L4.83 12L3.41 13.41L9 19L21 7L19.59 5.59L9 16.17Z" fill="currentColor"/>
                        </svg>
                        Book Appointment
                    </Button>
                </form>
            </div>
        </div>
    )
}

export default PostUser