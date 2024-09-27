import React, { useEffect, useState } from "react";
import { addIssues, getAllComponents, makePayment } from "./api";
import Navbar from "./Navbar";

const CustomerHome = ({ userId }) => {
  const [vehicleName, setVehicleName] = useState("");
  const [issueDescription, setIssueDescription] = useState("");
  const [issues, setIssues] = useState([]);
  const [selectedComponent, setSelectedComponent] = useState({});
  const [finalPrice, setFinalPrice] = useState(null);
  const [components, setComponents] = useState([]);
  const [paymentSuccess, setPaymentSuccess] = useState(null);

  useEffect(() => {
    getAllComponents()
      .then((response) => {
        console.log(response);
        setComponents(response.data);
      })
      .catch((error) => {
        console.error("There was an error fetching the components!", error);
      });
  }, []);

  const handleAddIssue = () => {
    if (issueDescription.trim() === "" || !selectedComponent.componentId)
      return;
    const newIssue = {
      description: issueDescription,
      selectedComponent,
    };
    setIssues([...issues, newIssue]);
    setIssueDescription("");
    setSelectedComponent({});
  };

  const handleComponentSelection = (componentId, isNew) => {
    const selectedComp = components.find((comp) => comp.id === componentId);
    const price = isNew ? selectedComp.new_price : selectedComp.repair_price;
    setSelectedComponent({
      componentId,
      price,
      isNew,
      name: selectedComp.component_name,
    });
  };

  const handleSubmit = async () => {
    if (!vehicleName.trim() || issues.length === 0) {
      alert("Please add a vehicle and at least one issue.");
      return;
    }

    const vehicleData = {
      vehicle_name: vehicleName,
      user_id: userId,
      issues: issues.map((issue) => ({
        description: issue.description,
        component_id: issue.selectedComponent.componentId,
        is_new: issue.selectedComponent.isNew,
      })),
    };

    addIssues(vehicleData)
      .then((response) => {
        setFinalPrice(response.data.total_price);
      })
      .catch((error) => {
        console.error("Error saving vehicle and issues:", error);
      });
  };

  const handlePayment = async () => {
    const paymentData = {
      user_id: userId,
      amount: finalPrice,
      vehicle_name: vehicleName,
      issues: issues.length,
    };

    makePayment(paymentData)
      .then((response) => {
        if (response.status === 201) {
          setPaymentSuccess(true);
          setIssues([]);
          setFinalPrice(null);
          alert("Payment successful!");
        }
      })
      .catch((error) => {
        console.error("Error processing payment:", error);
        alert("Payment failed. Please try again.");
      });
  };

  return (
    <>
      <Navbar />
      <div
        className="d-flex justify-content-center align-items-center my-5"
        style={{ height: "100vh" }}
      >
        <div className="container" style={{ maxWidth: "600px" }}>
          <h2 className="text-center mb-4">Customer Dashboard</h2>

          <div className="mt-4">
            <h4>Add Vehicle</h4>
            <div className="mb-3">
              <input
                type="text"
                className="form-control"
                value={vehicleName}
                onChange={(e) => setVehicleName(e.target.value)}
                placeholder="Enter Vehicle Name"
              />
            </div>
          </div>

          <div className="my-4">
            <h4>Add Issues</h4>
            <input
              type="text"
              className="form-control mb-2"
              value={issueDescription}
              onChange={(e) => setIssueDescription(e.target.value)}
              placeholder="Enter Issue Description"
              disabled={!vehicleName}
            />
            <h6 className="my-4">Select Component</h6>
            {components.map((component) => (
              <div
                key={component.id}
                className="d-flex my-2 justify-content-between"
              >
                <p>{component.component_name}</p>
                <div>
                  <button
                    className="btn btn-secondary"
                    onClick={() =>
                      handleComponentSelection(component.id, false)
                    }
                  >
                    Repair (${component.repair_price})
                  </button>
                  <button
                    className="btn btn-secondary ms-2"
                    onClick={() => handleComponentSelection(component.id, true)}
                  >
                    New (${component.new_price})
                  </button>
                </div>
              </div>
            ))}
            <button
              className="btn btn-success mt-3 w-100"
              onClick={handleAddIssue}
              disabled={!vehicleName}
            >
              Add Issue
            </button>
          </div>

          {/* Issue List */}
          {issues.length > 0 && (
            <div className="mt-4">
              <h5>Issues List</h5>
              <ul className="list-group">
                {issues.map((issue, index) => (
                  <li key={index} className="list-group-item">
                    <strong>Vehicle:</strong> {vehicleName} <br />
                    <strong>Issue:</strong> {issue.description} <br />
                    <strong>Component:</strong> {issue.selectedComponent.name}{" "}
                    <br />
                    <strong>Type:</strong>{" "}
                    {issue.selectedComponent.isNew ? "New" : "Repair"} <br />
                    <strong>Price:</strong> ${issue.selectedComponent.price}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="mt-4">
            <button className="btn btn-primary w-100" onClick={handleSubmit}>
              Submit Vehicle Information
            </button>
            {finalPrice !== null && (
              <div className="alert alert-success mt-4 text-center">
                Final Price: ${finalPrice}
              </div>
            )}

            {finalPrice !== null && (
              <button
                className="btn btn-success w-100 mt-3"
                onClick={handlePayment}
              >
                Pay
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default CustomerHome;
