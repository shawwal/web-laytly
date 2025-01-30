// DataDeletionInstruction.tsx
import React from 'react';

const DataDeletionInstruction: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto p-4 md:p-6 lg:p-8">
      <h1 className="text-gray-600 text-2xl mb-4">Data Deletion Instruction</h1>
      <p className="text-gray-600 text-sm mb-4">
        If you want to delete your data from Laytly, please follow these steps:
      </p>
      <ol className="list-decimal ml-4">
        <li>
          Log in to your Laytly account in the mobile app.
        </li>
        <li>
          Go to Settings.
        </li>
        <li>
          Select the Account page.
        </li>
        <li>
          Press "Delete Account".
        </li>
      </ol>
      <p className="text-gray-600 text-sm mb-4">
        Alternatively, you can email us at <a href="mailto:admin@laytly.com" className="text-blue-500">admin@laytly.com</a> to request data deletion.
      </p>
      <p className="text-gray-600 text-sm mb-4">
        Please note that deleting your account will permanently remove all of your data from Laytly.
      </p>
    </div>
  );
};

export default DataDeletionInstruction;