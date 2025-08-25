// Filename: src/components/Loader.jsx (conventionally, component filenames are capitalized)

import './loader.css';

const Loader = () => {
  return (
    <div className="loader-container" aria-label="Loading invitation...">
      <div className="loader">
        <div className="loader-initials">J & A</div>
      </div>
    </div>
  );
};

export default Loader;