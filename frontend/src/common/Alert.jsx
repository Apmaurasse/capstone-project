import React from "react";

// Alert component for displaying validation errors
// Usage: <Alert type="danger" messages={["Error message 1", "Error message 2"]} />
// Displays "Error message 1" and "Error message 2" in a red alert

function Alert({ type = "danger", messages = [] }) {
  console.debug("Alert", "type=", type, "messages=", messages);

  return (
      <div className={`alert alert-${type}`} role="alert">
        {messages.map(error => (
            <p className="mb-0 small" key={error}>
              {error}
            </p>
        ))}
      </div>
  );
}

export default Alert;