import React from "react";

const SectionTitle = ({ title, subtitle }) => {
  return (
    <div className="mb-10 text-center">
      <div className="mb-4 flex items-center justify-center gap-3">
        <h3 className="text-2xl uppercase tracking-wide text-gray-500">
          {title}
        </h3>

        <span className="h-px w-12 bg-gray-700" />
      </div>

      {subtitle && (
        <p className="mx-auto max-w-2xl text-sm text-gray-500">{subtitle}</p>
      )}
    </div>
  );
};

export default SectionTitle;
