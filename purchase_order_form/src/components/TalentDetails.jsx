import React, { useState, useEffect } from 'react';

const TalentDetails = ({ 
  section, 
  index, 
  purchaseOrderType, 
  clientName,
  isSubmitted, 
  errors, 
  updateReqSection, 
  removeReqSection,
  showRemove
}) => {
  const jobTitleOptions = ['Software Engineer', 'Project Manager', 'UX Designer', 'Data Analyst'];

  const mockTalents = {
    'Software Engineer': [
      { id: 1, name: 'John Doe', details: {} },
      { id: 2, name: 'Jane Smith', details: {} },
      { id: 3, name: 'Robert Johnson', details: {} }
    ],
    'Project Manager': [
      { id: 4, name: 'Emily Davis', details: {} },
      { id: 5, name: 'Michael Wilson', details: {} }
    ],
    'UX Designer': [
      { id: 6, name: 'Sarah Brown', details: {} },
      { id: 7, name: 'David Miller', details: {} },
      { id: 8, name: 'Lisa Taylor', details: {} }
    ],
    'Data Analyst': [
      { id: 9, name: 'James Anderson', details: {} },
      { id: 10, name: 'Jennifer Thomas', details: {} }
    ]
  };

  const [talents, setTalents] = useState([]);

  useEffect(() => {
    if (section.jobTitle && mockTalents[section.jobTitle]) {
      const existingTalentsMap = {};
      section.talents.forEach(talent => {
        existingTalentsMap[talent.id] = talent;
      });

      const newTalents = mockTalents[section.jobTitle].map(talent => {
        const existingTalent = existingTalentsMap[talent.id];
        return existingTalent || { 
          ...talent, 
          selected: false, 
          details: {
            contractDuration: '',
            billRate: '',
            billCurrency: '',
            standardRate: '',
            standardCurrency: '',
            overtimeRate: '',
            overtimeCurrency: ''
          }
        };
      });

      setTalents(newTalents);
      updateReqSection(section.id, { talents: newTalents });
    } else {
      setTalents([]);
      updateReqSection(section.id, { talents: [] });
    }
  }, [section.jobTitle]);

  const handleJobTitleChange = (e) => {
    const jobTitle = e.target.value;
    const reqId = `REQ-${jobTitle.replace(/\s+/g, '-')}-${Math.floor(Math.random() * 1000)}`;

  const updatedTalents = section.talents || [];

  updateReqSection(section.id, { 
    jobTitle, 
    reqId, 
    talents: updatedTalents 
  });
};


  const handleTalentSelect = (talentId) => {
    if (isSubmitted) return;
    const updatedTalents = talents.map(talent => {
      if (talent.id === talentId) {
        return { ...talent, selected: !talent.selected };
      } else if (purchaseOrderType === 'Individual PO') {
        return { ...talent, selected: false };
      }
      return talent;
    });
    setTalents(updatedTalents);
    updateReqSection(section.id, { talents: updatedTalents });
  };

  const handleTalentDetailsChange = (talentId, field, value) => {
    const updatedTalents = talents.map(talent => 
      talent.id === talentId 
        ? { ...talent, details: { ...talent.details, [field]: value } } 
        : talent
    );
    setTalents(updatedTalents);
    updateReqSection(section.id, { talents: updatedTalents });
  };

  return (
    <div className="req-section border rounded p-3 mb-3">
      
      {/* Section Header */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 className="mb-0">Job Title / REQ Name</h5>
      </div>

      {showRemove && (
        <button 
          type="button" 
          className="btn btn-sm btn-outline-danger float-end mb-2"
          onClick={() => removeReqSection(section.id)}
          disabled={isSubmitted}
        >
          Remove
        </button>
      )}

      {/* Job Title Select */}
      <div className="mb-3">
        <label className="form-label">Job Title / REQ Name <span className="required">*</span></label>
        <select 
          className={`form-select ${errors[`jobTitle-${index}`] ? 'is-invalid' : ''}`}
          value={section.jobTitle}
          onChange={handleJobTitleChange}
          disabled={isSubmitted}
        >
          <option value="">Select Job Title</option>
          {jobTitleOptions.map((job, idx) => (
            <option key={idx} value={job}>{job}</option>
          ))}
        </select>
        {errors[`jobTitle-${index}`] && <div className="invalid-feedback">{errors[`jobTitle-${index}`]}</div>}
      </div>

      {/* REQID */}
      {section.jobTitle && (
        <div className="mb-3">
          <label className="form-label">REQID / Assignment ID</label>
          <input 
            type="text" 
            className="form-control"
            value={section.reqId}
            readOnly
          />
        </div>
      )}

      {/* Talents Listing */}
      {section.jobTitle && talents.length > 0 && (
        <div className="mb-3">
          <h6>Talents Listing & Selection</h6>
          
          {errors[`talents-${index}`] && (
            <div className="alert alert-danger">{errors[`talents-${index}`]}</div>
          )}
          
          {talents.map(talent => (
            <div key={talent.id} className="card mb-2">
              <div className="card-body">
                
                {/* Employee Name */}
                <div className="form-check mb-2">
                  <input 
                    className="form-check-input"
                    type="checkbox"
                    id={`talent-${section.id}-${talent.id}`}
                    checked={talent.selected || false}
                    onChange={() => handleTalentSelect(talent.id)}
                    disabled={isSubmitted}
                  />
                  <label className="form-check-label fw-bold" htmlFor={`talent-${section.id}-${talent.id}`}>
                    {talent.name}
                  </label>
                </div>

                {/* Employee Details (Horizontal Line) */}
                {talent.selected && (
                  <div className="talent-details mt-2">
                    <div className="row g-2 align-items-center">
                      <div className="col-auto">
                        <input 
                          type="number"
                          className="form-control"
                          placeholder="Contract Duration (Months)"
                          value={talent.details.contractDuration}
                          onChange={(e) => handleTalentDetailsChange(talent.id, 'contractDuration', e.target.value)}
                          disabled={isSubmitted}
                        />
                      </div>
                      <div className="col-auto">
                        <input 
                          type="number"
                          className="form-control"
                          placeholder="Bill Rate (/hr)"
                          value={talent.details.billRate}
                          onChange={(e) => handleTalentDetailsChange(talent.id, 'billRate', e.target.value)}
                          disabled={isSubmitted}
                        />
                      </div>
                      <div className="col-auto">
                        <input 
                          type="text"
                          className="form-control"
                          placeholder="Bill Currency"
                          value={talent.details.billCurrency}
                          onChange={(e) => handleTalentDetailsChange(talent.id, 'billCurrency', e.target.value)}
                          disabled={isSubmitted}
                        />
                      </div>
                      <div className="col-auto">
                        <input 
                          type="number"
                          className="form-control"
                          placeholder="Standard Rate (/hr)"
                          value={talent.details.standardRate}
                          onChange={(e) => handleTalentDetailsChange(talent.id, 'standardRate', e.target.value)}
                          disabled={isSubmitted}
                        />
                      </div>
                      <div className="col-auto">
                        <input 
                          type="text"
                          className="form-control"
                          placeholder="Standard Currency"
                          value={talent.details.standardCurrency}
                          onChange={(e) => handleTalentDetailsChange(talent.id, 'standardCurrency', e.target.value)}
                          disabled={isSubmitted}
                        />
                      </div>
                      <div className="col-auto">
                        <input 
                          type="number"
                          className="form-control"
                          placeholder="Overtime Rate (/hr)"
                          value={talent.details.overtimeRate}
                          onChange={(e) => handleTalentDetailsChange(talent.id, 'overtimeRate', e.target.value)}
                          disabled={isSubmitted}
                        />
                      </div>
                      <div className="col-auto">
                        <input 
                          type="text"
                          className="form-control"
                          placeholder="Overtime Currency"
                          value={talent.details.overtimeCurrency}
                          onChange={(e) => handleTalentDetailsChange(talent.id, 'overtimeCurrency', e.target.value)}
                          disabled={isSubmitted}
                        />
                      </div>
                    </div>
                  </div>
                )}

              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TalentDetails;
