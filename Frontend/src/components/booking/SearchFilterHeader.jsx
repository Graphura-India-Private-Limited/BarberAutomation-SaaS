import { useEffect, useState } from "react";

export default function SearchFilterHeader({ onFiltersChange }) {
  const [search, setSearch] = useState("");
  const [selectedCost, setSelectedCost] = useState("");
  const [selectedDistance, setSelectedDistance] = useState("");
  const [selectedRating, setSelectedRating] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    onFiltersChange({
      search,
      cost: selectedCost,
      distance: selectedDistance,
      rating: selectedRating
    });
  }, [search, selectedCost, selectedDistance, selectedRating, onFiltersChange]);

  const costOptions = [
    { label: "Under ₹200", value: "under200" },
    { label: "₹200-500", value: "200-500" },
    { label: "₹500-1000", value: "500-1000" },
    { label: "Above ₹1000", value: "above1000" }
  ];

  const distanceOptions = [
    { label: "Within 1km", value: "1" },
    { label: "Within 2km", value: "2" },
    { label: "Within 5km", value: "5" },
    { label: "Within 10km", value: "10" }
  ];

  const ratingOptions = [
    { label: "4+ ⭐", value: "4" },
    { label: "4.5+ ⭐", value: "4.5" },
    { label: "5 ⭐", value: "5" }
  ];

  const toggleOption = (value, setter, current) => {
    setter(current === value ? "" : value);
  };

  const clearFilters = () => {
    setSearch("");
    setSelectedCost("");
    setSelectedDistance("");
    setSelectedRating("");
  };

  return (
    <div style={{ padding: "20px", backgroundColor: "#f8f9fa", borderBottom: "1px solid #ddd" }}>
      <div style={{ display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap" }}>
        <input
          type="text"
          placeholder="Search "
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            flex: 1,
            minWidth: "220px",
            padding: "10px",
            border: "1px solid #ccc",
            borderRadius: "4px"
          }}
        />

        <button
          type="button"
          onClick={() => setShowFilters((prev) => !prev)}
          style={{
            padding: "10px 18px",
            border: "1px solid #007bff",
            borderRadius: "4px",
            backgroundColor: showFilters ? "#007bff" : "#fff",
            color: showFilters ? "#fff" : "#007bff",
            cursor: "pointer",
            whiteSpace: "nowrap"
          }}
        >
          {showFilters ? "Hide Filters" : "Filters"}
        </button>
      </div>

      {showFilters && (
        <div style={{ marginTop: "16px", display: "grid", gap: "16px", maxHeight: "200px", overflowY: "auto", paddingRight: "4px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px" }}>
            <div style={{ fontWeight: "bold" }}>Filter options</div>
            <button
              type="button"
              onClick={clearFilters}
              style={{
                padding: "8px 14px",
                border: "1px solid #ccc",
                borderRadius: "4px",
                backgroundColor: "#fff",
                cursor: "pointer"
              }}
            >
              Clear Filters
            </button>
          </div>

          <div>
            <div style={{ marginBottom: "8px", fontWeight: "bold" }}>Cost</div>
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              {costOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => toggleOption(option.value, setSelectedCost, selectedCost)}
                  style={{
                    padding: "8px 12px",
                    border: selectedCost === option.value ? "2px solid #007bff" : "1px solid #ccc",
                    backgroundColor: selectedCost === option.value ? "#e7f3ff" : "#fff",
                    borderRadius: "4px",
                    cursor: "pointer"
                  }}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div style={{ marginBottom: "8px", fontWeight: "bold" }}>Distance</div>
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              {distanceOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => toggleOption(option.value, setSelectedDistance, selectedDistance)}
                  style={{
                    padding: "8px 12px",
                    border: selectedDistance === option.value ? "2px solid #007bff" : "1px solid #ccc",
                    backgroundColor: selectedDistance === option.value ? "#e7f3ff" : "#fff",
                    borderRadius: "4px",
                    cursor: "pointer"
                  }}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div style={{ marginBottom: "8px", fontWeight: "bold" }}>Rating</div>
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              {ratingOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => toggleOption(option.value, setSelectedRating, selectedRating)}
                  style={{
                    padding: "8px 12px",
                    border: selectedRating === option.value ? "2px solid #007bff" : "1px solid #ccc",
                    backgroundColor: selectedRating === option.value ? "#e7f3ff" : "#fff",
                    borderRadius: "4px",
                    cursor: "pointer"
                  }}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
