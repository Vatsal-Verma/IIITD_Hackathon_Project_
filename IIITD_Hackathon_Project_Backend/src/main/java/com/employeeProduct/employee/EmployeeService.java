package com.employeeProduct.employee;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmployeeService {
    
    private final EmployeeRepo er;

    
    public Employee postEmployee(Employee employee){
        try {
            log.info("Saving employee to database: {}", employee.getName());
            employee.setDate(LocalDateTime.now()); 
            Employee savedEmployee = er.save(employee);
            log.info("Employee saved successfully with ID: {}", savedEmployee.getId());
            return savedEmployee;
        } catch (Exception e) {
            log.error("Error saving employee: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to save employee: " + e.getMessage(), e);
        }
    }

    public List<Employee> getAllEmployee(){
        try {
            log.info("Fetching all employees from database");
            List<Employee> employees = er.findAll();
            log.info("Successfully fetched {} employees from database", employees.size());
            return employees;
        } catch (Exception e) {
            log.error("Error fetching all employees: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to fetch employees: " + e.getMessage(), e);
        }
    }

    public void deleteEmployee(String id) {
        try {
            log.info("Checking if employee exists with ID: {}", id);
            if(!er.existsById(id)) {
                log.warn("Employee with ID {} not found for deletion", id);
                throw new RuntimeException("Employee with ID " + id + " not found");
            }
            log.info("Deleting employee with ID: {}", id);
            er.deleteById(id);
            log.info("Employee with ID {} deleted successfully", id);
        } catch (Exception e) {
            log.error("Error deleting employee with ID {}: {}", id, e.getMessage(), e);
            throw new RuntimeException("Failed to delete employee: " + e.getMessage(), e);
        }
    }

    public Employee getEmployeeById(String id) {
        try {
            log.info("Fetching employee by ID: {}", id);
            Optional<Employee> employeeOpt = er.findById(id);
            if (employeeOpt.isPresent()) {
                Employee employee = employeeOpt.get();
                log.info("Employee found: {} with ID: {}", employee.getName(), id);
                return employee;
            } else {
                log.warn("Employee with ID {} not found", id);
                return null;
            }
        } catch (Exception e) {
            log.error("Error fetching employee by ID {}: {}", id, e.getMessage(), e);
            throw new RuntimeException("Failed to fetch employee: " + e.getMessage(), e);
        }
    }

    public Employee updateEmployee(String id, Employee employee) {
        try {
            log.info("Updating employee with ID: {}", id);
            Optional<Employee> oe = er.findById(id);
            if(oe.isPresent()) {
                Employee ee = oe.get();
                log.info("Found existing employee: {} with ID: {}", ee.getName(), id);
                
                // Update fields
                ee.setEmail(employee.getEmail());
                ee.setName(employee.getName());
                ee.setPhone(employee.getPhone());
                ee.setDepartment(employee.getDepartment());
                ee.setDate(LocalDateTime.now()); 
                ee.setStatus(employee.getStatus());
                ee.setAge(employee.getAge());
                ee.setGender(employee.getGender());
                
                Employee updatedEmployee = er.save(ee);
                log.info("Employee updated successfully: {} with ID: {}", updatedEmployee.getName(), id);
                return updatedEmployee;
            } else {
                log.warn("Employee with ID {} not found for update", id);
                return null;
            }
        } catch (Exception e) {
            log.error("Error updating employee with ID {}: {}", id, e.getMessage(), e);
            throw new RuntimeException("Failed to update employee: " + e.getMessage(), e);
        }
    }
}