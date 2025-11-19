import React, { useState } from "react";
import TalentDetails from "./TalentDetails";

const PurchaseOrderForm = () => {
  const [formData, setFormData] = useState({
    clientName: "",
    purchaseOrderType: "",
    purchaseOrderNo: "",
    receivedOn: "",
    receivedFrom: { name: "", email: "" },
    poStartDate: "",
    poEndDate: "",
    budget: "",
    currency: "USD",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [reqSections, setReqSections] = useState([
    { id: 1, jobTitle: "", reqId: "", talents: [] },
  ]);

  const clientOptions = ["Client A", "Client B", "Client C"];
  const poTypeOptions = ["Group PO", "Individual PO"];
  const currencyOptions = ["USD", "EUR", "GBP", "JPY"];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) setErrors({ ...errors, [name]: null });
  };

  const handleNestedChange = (e, parent) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [parent]: { ...formData[parent], [name]: value },
    });
    if (errors[`${parent}.${name}`])
      setErrors({ ...errors, [`${parent}.${name}`]: null });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.clientName) newErrors.clientName = "Client Name is required";
    if (!formData.purchaseOrderType)
      newErrors.purchaseOrderType = "Purchase Order Type is required";
    if (!formData.purchaseOrderNo)
      newErrors.purchaseOrderNo = "Purchase Order No. is required";
    if (!formData.receivedOn) newErrors.receivedOn = "Received On is required";
    if (!formData.receivedFrom.name)
      newErrors["receivedFrom.name"] = "Name is required";
    if (!formData.receivedFrom.email)
      newErrors["receivedFrom.email"] = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.receivedFrom.email))
      newErrors["receivedFrom.email"] = "Email is invalid";
    if (!formData.poStartDate)
      newErrors.poStartDate = "PO Start Date is required";
    if (!formData.poEndDate) newErrors.poEndDate = "PO End Date is required";
    if (
      formData.poStartDate &&
      formData.poEndDate &&
      new Date(formData.poEndDate) < new Date(formData.poStartDate)
    ) {
      newErrors.poEndDate = "PO End Date cannot be before PO Start Date";
    }
    if (!formData.budget) newErrors.budget = "Budget is required";
    else if (isNaN(formData.budget) || formData.budget.length > 5) {
      newErrors.budget = "Budget must be a number with max 5 digits";
    }

    reqSections.forEach((section, index) => {
      if (!section.jobTitle)
        newErrors[`jobTitle-${index}`] = "Job Title is required";
      const selectedTalents = section.talents.filter((t) => t.selected);
      if (
        formData.purchaseOrderType === "Individual PO" &&
        selectedTalents.length !== 1
      ) {
        newErrors[`talents-${index}`] =
          "Exactly one talent must be selected for Individual PO";
      } else if (
        formData.purchaseOrderType === "Group PO" &&
        selectedTalents.length < 2
      ) {
        newErrors[`talents-${index}`] =
          "At least two talents must be selected for Group PO";
      }
      selectedTalents.forEach((talent) => {
        if (!talent.details || talent.details.trim() === "") {
          newErrors[`talentDetails-${section.id}-${talent.id}`] =
            "Talent details are required";
        }
      });
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
  e.preventDefault();

  if (validateForm()) {
    // Alert message
    alert("Form submitted successfully!");

    setIsSubmitted(true);
  } else {
    alert("Please fill all required fields correctly!");
  }
};


  const handleReset = () => {
    setFormData({
      clientName: "",
      purchaseOrderType: "",
      purchaseOrderNo: "",
      receivedOn: "",
      receivedFrom: { name: "", email: "" },
      poStartDate: "",
      poEndDate: "",
      budget: "",
      currency: "USD",
    });
    setReqSections([{ id: 1, jobTitle: "", reqId: "", talents: [] }]);
    setErrors({});
    setIsSubmitted(false);
  };

  const addReqSection = () => {
    if (formData.purchaseOrderType === "Group PO") {
      setReqSections([
        ...reqSections,
        { id: reqSections.length + 1, jobTitle: "", reqId: "", talents: [] },
      ]);
    }
  };

  const removeReqSection = (id) => {
    if (reqSections.length > 1)
      setReqSections(reqSections.filter((section) => section.id !== id));
  };

  const updateReqSection = (id, data) => {
    setReqSections(
      reqSections.map((section) =>
        section.id === id ? { ...section, ...data } : section
      )
    );
  };

  return (
    <form onSubmit={handleSubmit} className="purchase-order-form">
      <div className="d-flex align-items-center mb-4">
        <button type="button" className="btn btn-link p-0 me-3">
          &lt;
        </button>
        <h2 className="mb-0">Purchase Order | NEW</h2>
      </div>

      <div className="form-section">
        <h2>Purchase Order Details</h2>
        <div className="row g-3">
          <div className="col-md-3">
            <label className="form-label">
              Client Name <span className="required">*</span>
            </label>
            <select
              className={`form-select ${errors.clientName ? "is-invalid" : ""}`}
              name="clientName"
              value={formData.clientName}
              onChange={handleChange}
              disabled={isSubmitted}
            >
              <option value="">Select Client</option>
              {clientOptions.map((client, idx) => (
                <option key={idx} value={client}>
                  {client}
                </option>
              ))}
            </select>
            {errors.clientName && (
              <div className="error-message">{errors.clientName}</div>
            )}
          </div>

          <div className="col-md-3">
            <label className="form-label">
              Purchase Order Type <span className="required">*</span>
            </label>
            <select
              className={`form-select ${
                errors.purchaseOrderType ? "is-invalid" : ""
              }`}
              name="purchaseOrderType"
              value={formData.purchaseOrderType}
              onChange={handleChange}
              disabled={isSubmitted}
            >
              <option value="">Select Type</option>
              {poTypeOptions.map((type, idx) => (
                <option key={idx} value={type}>
                  {type}
                </option>
              ))}
            </select>
            {errors.purchaseOrderType && (
              <div className="error-message">{errors.purchaseOrderType}</div>
            )}
          </div>

          <div className="col-md-3">
            <label className="form-label">
              Purchase Order No. <span className="required">*</span>
            </label>
            <input
              type="text"
              placeholder="PO Number"
              className={`form-control ${
                errors.purchaseOrderNo ? "is-invalid" : ""
              }`}
              name="purchaseOrderNo"
              value={formData.purchaseOrderNo}
              onChange={handleChange}
              disabled={isSubmitted}
            />
            {errors.purchaseOrderNo && (
              <div className="error-message">{errors.purchaseOrderNo}</div>
            )}
          </div>

          <div className="col-md-3">
            <label className="form-label">
              Received On <span className="required">*</span>
            </label>
            <input
              type="date"
              className={`form-control ${
                errors.receivedOn ? "is-invalid" : ""
              }`}
              name="receivedOn"
              value={formData.receivedOn}
              onChange={handleChange}
              disabled={isSubmitted}
            />
            {errors.receivedOn && (
              <div className="error-message">{errors.receivedOn}</div>
            )}
          </div>
        </div>

        {/* Second Row */}
        <div className="row g-3 mt-3">
          {/* Received From Name */}
          <div className="col-md-3">
            <label className="form-label">
              Received From Name <span className="required">*</span>
            </label>
            <input
              type="text"
              placeholder="Received From Name"
              className={`form-control ${
                errors["receivedFrom.name"] ? "is-invalid" : ""
              }`}
              name="name"
              value={formData.receivedFrom.name}
              onChange={(e) => handleNestedChange(e, "receivedFrom")}
              disabled={isSubmitted}
            />
            {errors["receivedFrom.name"] && (
              <div className="error-message">{errors["receivedFrom.name"]}</div>
            )}
          </div>

          {/* Received From Email */}
          <div className="col-md-3 d-flex flex-column justify-content-end">
            <input
              type="email"
              placeholder="Received From Email ID"
              className={`form-control ${
                errors["receivedFrom.email"] ? "is-invalid" : ""
              }`}
              name="email"
              value={formData.receivedFrom.email}
              onChange={(e) => handleNestedChange(e, "receivedFrom")}
              disabled={isSubmitted}
              style={{ paddingTop: "0.375rem", paddingBottom: "0.375rem" }} // optional: height adjust
            />
            {errors["receivedFrom.email"] && (
              <div className="error-message">
                {errors["receivedFrom.email"]}
              </div>
            )}
          </div>

          {/* PO Start & End Dates */}
          <div className="col-md-3 d-flex gap-2">
            <div className="w-50">
              <label className="form-label">
                PO Start Date <span className="required">*</span>
              </label>
              <input
                type="date"
                className={`form-control ${
                  errors.poStartDate ? "is-invalid" : ""
                }`}
                name="poStartDate"
                value={formData.poStartDate}
                onChange={handleChange}
                disabled={isSubmitted}
              />
              {errors.poStartDate && (
                <div className="error-message">{errors.poStartDate}</div>
              )}
            </div>
            <div className="w-50">
              <label className="form-label">
                PO End Date <span className="required">*</span>
              </label>
              <input
                type="date"
                className={`form-control ${
                  errors.poEndDate ? "is-invalid" : ""
                }`}
                name="poEndDate"
                value={formData.poEndDate}
                onChange={handleChange}
                min={formData.poStartDate}
                disabled={isSubmitted}
              />
              {errors.poEndDate && (
                <div className="error-message">{errors.poEndDate}</div>
              )}
            </div>
          </div>

          <div className="col-md-3 d-flex gap-2">
            <div className="w-50">
              <label className="form-label">
                Budget <span className="required">*</span>
              </label>
              <input
                type="text"
                placeholder="Budget"
                className={`form-control ${errors.budget ? "is-invalid" : ""}`}
                name="budget"
                value={formData.budget}
                onChange={handleChange}
                disabled={isSubmitted}
              />
              {errors.budget && (
                <div className="error-message">{errors.budget}</div>
              )}
            </div>
            <div className="w-50">
              <label className="form-label">Currency</label>
              <select
                className="form-select"
                name="currency"
                value={formData.currency}
                onChange={handleChange}
                disabled={isSubmitted}
              >
                {currencyOptions.map((c, idx) => (
                  <option key={idx} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Talent Details Section */}
      <div className="form-section mt-4">
        <h2>Talent Details</h2>
        {reqSections.map((section, index) => (
          <TalentDetails
            key={section.id}
            section={section}
            index={index}
            purchaseOrderType={formData.purchaseOrderType}
            clientName={formData.clientName}
            isSubmitted={isSubmitted}
            errors={errors}
            updateReqSection={updateReqSection}
            removeReqSection={removeReqSection}
            showRemove={reqSections.length > 1}
          />
        ))}

        {formData.purchaseOrderType === "Group PO" && !isSubmitted && (
          <div className="text-end mt-3">
            <button
              type="button"
              className="btn btn-outline-primary"
              onClick={addReqSection}
            >
              Add Another
            </button>
          </div>
        )}
      </div>

      {/* Form Actions */}
      <div className="d-flex justify-content-end mt-4 gap-2">
        <button
          type="button"
          className="btn btn-secondary rounded-pill px-4"
          onClick={handleReset}
        >
          Reset
        </button>
        <button
          type="submit"
          className="btn btn-secondary rounded-pill px-4"
          disabled={isSubmitted}
        >
          Submit
        </button>
      </div>

      {/* Display submitted data in read-only mode */}
      {isSubmitted && (
        <div className="mt-4 p-3 border rounded">
          <h3>Submitted Purchase Order</h3>
          <div className="row">
            <div className="col-md-6">
              <p>
                <strong>Client Name:</strong> {formData.clientName}
              </p>
              <p>
                <strong>Purchase Order Type:</strong>{" "}
                {formData.purchaseOrderType}
              </p>
              <p>
                <strong>Purchase Order No.:</strong> {formData.purchaseOrderNo}
              </p>
              <p>
                <strong>Received On:</strong> {formData.receivedOn}
              </p>
              <p>
                <strong>Received From:</strong> {formData.receivedFrom.name} (
                {formData.receivedFrom.email})
              </p>
            </div>
            <div className="col-md-6">
              <p>
                <strong>PO Start Date:</strong> {formData.poStartDate}
              </p>
              <p>
                <strong>PO End Date:</strong> {formData.poEndDate}
              </p>
              <p>
                <strong>Budget:</strong> {formData.budget} {formData.currency}
              </p>
            </div>
          </div>

          <h4 className="mt-3">Talent Details</h4>
          {reqSections.map((section, index) => (
            <div key={section.id} className="mb-3">
              <h5>REQ #{index + 1}</h5>
              <p>
                <strong>Job Title:</strong> {section.jobTitle}
              </p>
              <p>
                <strong>REQ ID:</strong> {section.reqId}
              </p>

              <h6>Selected Talents:</h6>
              {section.talents
                .filter((talent) => talent.selected)
                .map((talent) => (
                  <div key={talent.id} className="ml-3">
                    <p>
                      <strong>Name:</strong> {talent.name}
                    </p>
                    <p>
                      <strong>Details:</strong> {talent.details}
                    </p>
                  </div>
                ))}
            </div>
          ))}
        </div>
      )}
    </form>
  );
};

export default PurchaseOrderForm;
