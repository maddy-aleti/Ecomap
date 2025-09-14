import "./ReportIssue.css";
import { Link } from "react-router-dom";

function ReportIssue() {
  return (
    <div className="report-bg">
      <div className="report-card">
        <h1 className="report-title">Report Environmental Issue</h1>
        <p className="report-desc">
          Provide detailed information about the environmental issue you discovered to help relevant authorities respond quickly
        </p>
        <form className="report-form">
          <label>
            Issue Title *
            <input type="text" placeholder="Brief description of the issue, e.g., 'Overflowing trash bin in park'" maxLength={100} />
            <span className="input-hint">0/100</span>
          </label>
          <label>
            Issue Category *
            <select>
              <option>Waste Management</option>
              <option>Water Pollution</option>
              <option>Air Quality</option>
              <option>Other</option>
            </select>
          </label>
          <div className="severity-group">
            <span>Severity Level *</span>
            <div className="severity-options">
              <label className="severity-option minor">
                <input type="radio" name="severity" value="Minor" />
                <span>
                  <strong>Minor</strong>
                  <br />
                  <span className="severity-desc">Low impact</span>
                </span>
              </label>
              <label className="severity-option moderate">
                <input type="radio" name="severity" value="Moderate" />
                <span>
                  <strong>Moderate</strong>
                  <br />
                  <span className="severity-desc">Needs attention</span>
                </span>
              </label>
              <label className="severity-option severe">
                <input type="radio" name="severity" value="Severe" />
                <span>
                  <strong>Severe</strong>
                  <br />
                  <span className="severity-desc">Urgent action needed</span>
                </span>
              </label>
            </div>
          </div>
          <label>
            Detailed Description *
            <textarea placeholder="Please provide detailed information about the issue, including specific conditions, time of occurrence, impact area, etc..." maxLength={500} />
            <span className="input-hint">0/500</span>
          </label>
          <label>
            Location Information *
            <div className="location-input">
              <input type="text" placeholder="Enter specific address or click on map to select location" />
              <span className="location-icon">
                <svg width="20" height="20" fill="#2ecc40" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
              </span>
            </div>
            <span className="input-hint">GPS positioning is recommended for precise location</span>
          </label>
          <label>
            Related Photos
            <div className="photo-upload">
              <div className="photo-upload-box">
                <svg width="32" height="32" fill="#b2b2b2" viewBox="0 0 24 24"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14zm-7-3l2.5-3.01L17 17H7l3-4z"/></svg>
                <div>
                  <strong>Upload Issue Photos</strong>
                  <div>Drag photos here or click to select files</div>
                  <div className="photo-upload-hint">Supports JPG, PNG formats, maximum 5 photos</div>
                </div>
              </div>
            </div>
          </label>
          <div className="report-actions">
            <button type="submit" className="submit-btn">Submit Report</button>
            <button type="button" className="cancel-btn">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ReportIssue;