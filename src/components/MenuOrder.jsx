import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { MapPin, X, Check, AlertCircle, Plus, Minus } from "lucide-react";
import { useAuth } from "./AuthSystem";

const DEFAULT_DELIVERY_FEE = 500;

const MenuOrder = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const location = useLocation();
  const {
    selectedItems = [],
    extraItems = [],
    platePrice = 0,
    // guestCount = 0,
    totalAmount = 0,
  } = location.state || {};
  const [guestCount, setGuestCount] = useState(
    location.state?.guestCount || 10
  );
  const [showPaymentSuccess, setShowPaymentSuccess] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState("");
  const [showCouponSuccess, setShowCouponSuccess] = useState(false);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [availableLocations, setAvailableLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState("");
  const [locationData, setLocationData] = useState([]);
  const [deliveryFee, setDeliveryFee] = useState(DEFAULT_DELIVERY_FEE);
  const [blockedDates, setBlockedDates] = useState([]);
  const [minDate, setMinDate] = useState("");
  const [gstPercentage, setGstPercentage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [resources, setResources] = useState({
    staff: { cost: 400, ratio: "100/4", min: 0 },
    helper: { cost: 300, ratio: "100/2", min: 0 },
    table: { cost: 200, ratio: "100/10", min: 0 },
  });

  const getCurrentDateInIST = () => {
    return new Date(
      new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
    );
  };

  // Calculate the minimum date (2 days ahead in IST)
  useEffect(() => {
    const todayInIST = getCurrentDateInIST();
    const dayAfterTomorrow = new Date(todayInIST);
    dayAfterTomorrow.setDate(todayInIST.getDate() + 3); // 2 days ahead
    setMinDate(dayAfterTomorrow.toISOString().split("T")[0]);
  }, []);

  // Check if the selected date is today or tomorrow in IST
  const isDateBlocked = (date) => {
    if (!date) return false; // Return false if the date is empty or invalid

    const todayInIST = getCurrentDateInIST();
    const tomorrowInIST = new Date(todayInIST);
    tomorrowInIST.setDate(todayInIST.getDate() + 1);

    const selectedDate = new Date(date);

    // Compare dates in IST
    return (
      selectedDate.toISOString().split("T")[0] ===
        todayInIST.toISOString().split("T")[0] ||
      selectedDate.toISOString().split("T")[0] ===
        tomorrowInIST.toISOString().split("T")[0]
    );
  };

  // Handle date change
  const handleDateChange = (e) => {
    const selectedDate = e.target.value;

    if (isDateBlocked(selectedDate)) {
      alert("For dates today or tomorrow, please choose the Superfast option.");
      setUserDetails((prev) => ({
        ...prev,
        date: "", // Clear the selected date
      }));
    } else {
      setUserDetails((prev) => ({
        ...prev,
        date: selectedDate,
      }));
    }
  };

  useEffect(() => {
    const fetchGSTRate = async () => {
      try {
        const response = await fetch(
          "https://mahaspice.desoftimp.com/ms3/displaygst.php"
        );
        const data = await response.json();

        if (data.success) {
          const bulkCateringGST = data.data.find(
            (item) => item.service_type === "bulk_catering"
          );

          if (bulkCateringGST) {
            setGstPercentage(bulkCateringGST.gst_percentage);
          } else {
            setError("Bulk catering GST rate not found");
          }
        } else {
          setError("Failed to fetch GST rates");
        }
      } catch (err) {
        setError("Error fetching GST rates");
      } finally {
        setLoading(false);
      }
    };

    fetchGSTRate();
  }, []);

  const handleGuestCountChange = (newCount) => {
    // Ensure minimum of 10 guests
    const validCount = Math.max(10, newCount);
    setGuestCount(validCount);

    // Update minimum requirements based on new guest count
    const minRequirements = calculateMinRequirements(validCount);

    // Update userDetails with new minimum requirements
    setUserDetails((prev) => ({
      ...prev,
      numberOfStaff: Math.max(minRequirements.staff, prev.numberOfStaff),
      numberOfHelpers: Math.max(minRequirements.helper, prev.numberOfHelpers),
      numberOfTables: Math.max(minRequirements.table, prev.numberOfTables),
    }));
  };

  const GuestCountControls = () => (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        Number of Guests *
      </label>
      <div className="flex items-center space-x-2">
        <button
          onClick={() => handleGuestCountChange(guestCount - 5)}
          className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200"
          aria-label="Decrease guest count by 5"
        >
          <Minus className="w-4 h-4" />
        </button>

        <input
          type="number"
          value={guestCount}
          onChange={(e) => {
            const value = e.target.value;
            if (value === "") {
              setGuestCount(""); // Allow empty input while typing
            } else {
              const newCount = parseInt(value, 10);
              if (!isNaN(newCount)) {
                handleGuestCountChange(newCount);
              }
            }
          }}
          onBlur={() => {
            if (guestCount === "" || isNaN(guestCount)) {
              handleGuestCountChange(10); // Reset to minimum on blur if invalid
            }
          }}
          min="10"
          className="w-20 p-2 border rounded-md text-center"
          aria-label="Guest count"
        />

        <button
          onClick={() => handleGuestCountChange(guestCount + 5)}
          className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200"
          aria-label="Increase guest count by 5"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>
    </div>
  );

  const [coupons, setCoupons] = useState([]);

  const groupItemsByCategory = (items) => {
    return items.reduce((acc, item) => {
      const category = item.category || "Uncategorized";
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(item);
      return acc;
    }, {});
  };

  const groupedItems = () => {
    const allItems = {};

    // Group selected items
    selectedItems.forEach((item) => {
      if (!allItems[item.category_name]) {
        allItems[item.category_name] = [];
      }
      allItems[item.category_name].push({
        ...item,
        isExtra: false,
      });
    });

    // Group extra items
    extraItems.forEach((item) => {
      if (!allItems[item.category_name]) {
        allItems[item.category_name] = [];
      }
      allItems[item.category_name].push({
        ...item,
        isExtra: true,
      });
    });

    return allItems;
  };

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await fetch(
          "https://mahaspice.desoftimp.com/ms3/displayDeloc.php"
        );
        const data = await response.json();

        if (data.success && data.locations) {
          // Filter locations for bulk catering and store full location data
          const bulkCateringLocations = data.locations.filter(
            (loc) => loc.service_type === "bulk_catering"
          );
          setLocationData(bulkCateringLocations);
        }
      } catch (error) {
        console.error("Error fetching locations:", error);
      }
    };

    fetchLocations();
  }, []);

  useEffect(() => {
    const fetchBlockedDates = async () => {
      try {
        const response = await fetch(
          "https://mahaspice.desoftimp.com/ms3/dateblocking.php"
        );
        const data = await response.json();

        // Filter dates that are blocked for "Catering"
        const cateringBlockedDates = data
          .filter((item) => item.for === "Catering")
          .map((item) => item.date);

        setBlockedDates(cateringBlockedDates);
      } catch (error) {
        console.error("Error fetching blocked dates:", error);
      }
    };

    fetchBlockedDates();
  }, []);

  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        const response = await fetch(
          "https://mahaspice.desoftimp.com/ms3/displaycoupons.php"
        );
        const data = await response.json();

        if (data.success) {
          // Filter coupons to only include bulk_catering and active ones
          const validCoupons = data.coupons.filter(
            (coupon) =>
              coupon.coupon_type === "bulk_catering" && coupon.is_active
          );
          setCoupons(validCoupons);
        }
      } catch (error) {
        console.error("Error fetching coupons:", error);
      }
    };

    fetchCoupons();
  }, []);

  const validateCoupon = (coupon, subtotal) => {
    const currentDate = new Date();
    const validFrom = new Date(coupon.valid_from);
    const validUntil = new Date(coupon.valid_until);

    // Check if the coupon is within its validity period
    if (currentDate < validFrom || currentDate > validUntil) {
      return { isValid: false, error: "Coupon is not valid at this time." };
    }

    // Check if the subtotal meets the minimum order value
    if (coupon.min_order_value && subtotal < coupon.min_order_value) {
      return {
        isValid: false,
        error: `Minimum order value of ₹${coupon.min_order_value} required.`,
      };
    }

    // Check if the usage limit has been reached
    if (coupon.usage_limit && coupon.usage_count >= coupon.usage_limit) {
      return { isValid: false, error: "Coupon usage limit reached." };
    }

    return { isValid: true };
  };

  useEffect(() => {
    const minRequirements = calculateMinRequirements(guestCount);

    setUserDetails((prev) => ({
      ...prev,
      numberOfStaff: Math.max(minRequirements.staff, prev.numberOfStaff),
      numberOfHelpers: Math.max(minRequirements.helper, prev.numberOfHelpers),
      numberOfTables: Math.max(minRequirements.table, prev.numberOfTables),
    }));
  }, [guestCount]);

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const response = await fetch(
          "https://mahaspice.desoftimp.com/ms3/get-resources.php"
        );
        const data = await response.json();

        if (data.success) {
          const resourcesMap = data.data.reduce((acc, resource) => {
            acc[resource.type] = {
              cost: Number(resource.cost_per_unit),
              ratio: resource.min_requirement_ratio,
              description: resource.description,
            };
            return acc;
          }, {});

          setResources(resourcesMap);
        }
      } catch (error) {
        console.error("Error fetching resources:", error);
      }
    };

    fetchResources();
  }, []);

  useEffect(() => {
    const minRequirements = calculateMinRequirements(guestCount);

    setUserDetails((prev) => ({
      ...prev,
      numberOfStaff: Math.max(prev.numberOfStaff, minRequirements.staff),
      numberOfHelpers: Math.max(prev.numberOfHelpers, minRequirements.helper),
      numberOfTables: Math.max(prev.numberOfTables, minRequirements.table),
    }));
  }, [guestCount, resources]);

  // Modify the handleInputChange function to enforce minimums
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (
      name === "numberOfStaff" ||
      name === "numberOfHelpers" ||
      name === "numberOfTables"
    ) {
      const minRequirements = calculateMinRequirements(guestCount);
      const resourceType = name.replace("numberOf", "").toLowerCase();
      const minValue = minRequirements[resourceType];

      if (Number(value) < minValue) {
        alert(
          `Minimum ${resourceType} requirement for ${guestCount} guests is ${minValue}`
        );
        return;
      }
    }

    if (name === "city") {
      const selectedLocationData = locationData.find(
        (loc) => loc.location === value
      );
      if (selectedLocationData) {
        setDeliveryFee(parseFloat(selectedLocationData.price));
      } else {
        setDeliveryFee(DEFAULT_DELIVERY_FEE);
      }
    }

    setUserDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const timeSlots = [
    "12:00 PM",
    "1:00 PM",
    "2:00 PM",
    "3:00 PM",
    "4:00 PM",
    "5:00 PM",
    "6:00 PM",
    "7:00 PM",
    "8:00 PM",
  ];

  const getAvailableTimeSlots = () => timeSlots;

  const [userDetails, setUserDetails] = useState({
    fullName: user?.name || "",
    email: user?.email || "",
    phoneNumber: user?.phone || "",
    alternateNumber: "",
    city: "",
    address: user?.address || "",
    landmark: "",
    date: "",
    time: "",
    numberOfTables: 0,
    numberOfStaff: 0,
    numberOfHelpers: 0,
  });

  useEffect(() => {
    if (user) {
      setUserDetails((prev) => ({
        ...prev,
        fullName: user.name || prev.fullName,
        email: user.email || prev.email,
        phoneNumber: user.phone || prev.phoneNumber,
        address: user.address || prev.address,
      }));
    }
  }, [user]);

  const detectLocation = () => {
    setIsLoadingLocation(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?lat=${position.coords.latitude}&lon=${position.coords.longitude}&format=json`
            );
            const data = await response.json();
            setUserDetails((prev) => ({
              ...prev,
              address:
                data.display_name ||
                "Location detected (Please add specific details)",
            }));
          } catch (error) {
            console.error("Error fetching address:", error);
          } finally {
            setIsLoadingLocation(false);
          }
        },
        (error) => {
          console.error("Error getting location:", error);
          setIsLoadingLocation(false);
        }
      );
    }
  };

  const calculateTotals = () => {
    // Guard against undefined values
    if (!resources.staff?.cost || !resources.helper?.cost || !resources.table?.cost) {
      return {
        baseCost: 0,
        extraItemsCost: 0,
        staffCost: 0,
        helperCost: 0,
        tablesCost: 0,
        subtotal: 0,
        discount: 0,
        gst: 0,
        deliveryFee: DEFAULT_DELIVERY_FEE,
        total: 0
      };
    }

    const staffCost = (userDetails.numberOfStaff || 0) * resources.staff.cost;
    const helperCost = (userDetails.numberOfHelpers || 0) * resources.helper.cost;
    const tablesCost = (userDetails.numberOfTables || 0) * resources.table.cost;

    const baseCost = (platePrice || 0) * (guestCount || 0);
    const extraItemsCost = (extraItems?.length || 0) * 50;

    const subtotal = baseCost + extraItemsCost + staffCost + helperCost + tablesCost;

    let discount = 0;
    if (appliedCoupon) {
      if (appliedCoupon.discount_type === "percentage") {
        discount = (subtotal * appliedCoupon.discount_value) / 100;
        if (appliedCoupon.max_discount && discount > appliedCoupon.max_discount) {
          discount = appliedCoupon.max_discount;
        }
      } else if (appliedCoupon.discount_type === "fixed") {
        discount = appliedCoupon.discount_value;
      }
    }

    const discountedSubtotal = subtotal - discount;
    const gst = gstPercentage ? discountedSubtotal * (gstPercentage / 100) : 0;
    const total = discountedSubtotal + gst + deliveryFee;

    return {
      baseCost,
      extraItemsCost,
      staffCost,
      helperCost,
      tablesCost,
      subtotal,
      discount,
      gst,
      deliveryFee,
      total
    };
  };
  

  const handleCouponApply = () => {
    setCouponError("");
    setShowCouponSuccess(false);

    if (!couponCode.trim()) {
      setCouponError("Please enter a coupon code");
      return;
    }

    const coupon = coupons.find((c) => c.code === couponCode.toUpperCase());

    if (!coupon) {
      setCouponError("Invalid coupon code");
      return;
    }

    const { isValid, error } = validateCoupon(coupon, totals.subtotal);

    if (!isValid) {
      setCouponError(error);
      return;
    }

    // Apply the coupon
    setAppliedCoupon(coupon);
    setShowCouponSuccess(true);
    setTimeout(() => setShowCouponSuccess(false), 3000);
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode("");
    setCouponError("");
  };

  const handleSubmit = () => {
    const requiredFields = [
      "fullName",
      "email",
      "phoneNumber",
      "city",
      "address",
      "landmark",
      "date",
      "time",
    ];

    const calculateMinRequirements = (guestCount) => {
      if (guestCount <= 0) {
        return {
          staff: 0,
          helper: 0,
          table: 0,
        };
      }

      const calculateForResource = (ratio) => {
        const [base, units] = ratio.split("/").map(Number);
        return Math.ceil((guestCount / base) * units);
      };

      return {
        staff: calculateForResource(resources.staff.ratio),
        helper: calculateForResource(resources.helper.ratio),
        table: calculateForResource(resources.table.ratio),
      };
    };

    const missingFields = requiredFields.filter((field) => !userDetails[field]);

    if (missingFields.length > 0) {
      alert(`Please fill in all required fields: ${missingFields.join(", ")}`);
      return;
    }

    setShowPaymentSuccess(true);
  };

  const renderResourceInputs = () => {
    const minRequirements = calculateMinRequirements(guestCount);

    return (
      <div className="bg-gray-50 p-4 rounded-lg space-y-4">
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Tables</label>
            <input
              type="number"
              name="numberOfTables"
              value={userDetails.numberOfTables}
              onChange={handleInputChange}
              min={minRequirements.table}
              className="w-full p-2 border rounded-md"
            />
            <span className="text-xs text-gray-500">
              ₹{resources.table.cost} each
            </span>
            <p className="text-xs text-blue-600">
              Min required: {minRequirements.table}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Staff</label>
            <input
              type="number"
              name="numberOfStaff"
              value={userDetails.numberOfStaff}
              onChange={handleInputChange}
              min={minRequirements.staff}
              className="w-full p-2 border rounded-md"
            />
            <span className="text-xs text-gray-500">
              ₹{resources.staff.cost} each
            </span>
            <p className="text-xs text-blue-600">
              Min required: {minRequirements.staff}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Helpers</label>
            <input
              type="number"
              name="numberOfHelpers"
              value={userDetails.numberOfHelpers}
              onChange={handleInputChange}
              min={minRequirements.helper}
              className="w-full p-2 border rounded-md"
            />
            <span className="text-xs text-gray-500">
              ₹{resources.helper.cost} each
            </span>
            <p className="text-xs text-blue-600">
              Min required: {minRequirements.helper}
            </p>
          </div>
        </div>

        <div className="text-sm text-gray-600 mt-2">
          <p>{resources.staff.description}</p>
          <p>{resources.helper.description}</p>
          <p>{resources.table.description}</p>
        </div>
      </div>
    );
  };

  const calculateMinRequirements = (guestCount) => {
    if (guestCount <= 0) {
      return {
        staff: 0,
        helper: 0,
        table: 0,
      };
    }

    const calculateForResource = (ratio) => {
      const [base, units] = ratio.split("/").map(Number);
      return Math.ceil((guestCount / base) * units);
    };

    return {
      staff: calculateForResource(resources.staff.ratio),
      helper: calculateForResource(resources.helper.ratio),
      table: calculateForResource(resources.table.ratio),
    };
  };

  const totals = calculateTotals();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Customer Details Form */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold mb-6">Customer Details</h2>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  name="fullName"
                  placeholder="Full Name *"
                  value={userDetails.fullName}
                  onChange={handleInputChange}
                  className="w-full p-3 border rounded-md"
                  disabled={!!user} // Disable if user is logged in
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Email *"
                  value={userDetails.email}
                  onChange={handleInputChange}
                  className="w-full p-3 border rounded-md"
                  disabled={!!user} // Disable if user is logged in
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <input
                  type="tel"
                  name="phoneNumber"
                  placeholder="Phone Number *"
                  value={userDetails.phoneNumber}
                  onChange={handleInputChange}
                  className="w-full p-3 border rounded-md"
                  disabled={!!user} // Disable if user is logged in
                />
                <input
                  type="tel"
                  name="alternateNumber"
                  placeholder="Alternate Number"
                  value={userDetails.alternateNumber}
                  onChange={handleInputChange}
                  className="w-full p-3 border rounded-md"
                />
              </div>

              <div className="space-y-2">
                <select
                  name="city"
                  value={userDetails.city}
                  onChange={handleInputChange}
                  className="w-full p-3 border rounded-md"
                  required
                >
                  <option value="">Select Area *</option>
                  {locationData.map((loc) => (
                    <option key={loc.id} value={loc.location}>
                      {loc.location}
                    </option>
                  ))}
                </select>
                {userDetails.city && (
                  <p className="text-sm text-gray-600">
                    Delivery Fee for {userDetails.city}: ₹
                    {deliveryFee.toFixed(2)}
                  </p>
                )}
              </div>

              <div className="relative">
                {/* <button
                  onClick={detectLocation}
                  className="p-2 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 flex items-center gap-2"
                >
                  <MapPin size={16} />
                  {isLoadingLocation ? "Detecting..." : "Use current location"}
                </button> */}
                <textarea
                  name="address"
                  placeholder="Delivery Address *"
                  value={userDetails.address}
                  onChange={handleInputChange}
                  className="w-full p-3 border rounded-md h-24"
                />
              </div>

              <input
                type="text"
                name="landmark"
                placeholder="Landmark *"
                value={userDetails.landmark}
                onChange={handleInputChange}
                className="w-full p-3 border rounded-md"
              />

              <GuestCountControls />

              <div className="grid grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Date *
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={userDetails.date}
                    onChange={handleDateChange} // Use the new handler
                    min={minDate} // Set minimum selectable date
                    className="w-full p-3 border rounded-md"
                  />

                  <p className="text-sm text-gray-600 mt-1">
                    For dates today or tomorrow, please choose the Superfast
                    option.
                  </p>
                  {isDateBlocked(userDetails.date) && (
                    <p className="text-sm text-red-600 mt-1">
                      This date is not available for catering.
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Time *
                  </label>
                  <select
                    name="time"
                    value={userDetails.time}
                    onChange={handleInputChange}
                    className={`w-full p-3 border rounded-md ${
                      isDateBlocked(userDetails.date)
                        ? "cursor-not-allowed"
                        : ""
                    }`}
                    disabled={isDateBlocked(userDetails.date)}
                  >
                    <option value="">Select Time</option>
                    {getAvailableTimeSlots().map((slot) => (
                      <option key={slot} value={slot}>
                        {slot}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Add this helper text */}
              {/* <div className="mt-2 text-sm text-gray-600">
                {guestCount < 30 && (
                  <p>
                    For orders under 30 guests: Available for tomorrow after
                    1:00 PM
                  </p>
                )}
                {guestCount >= 30 && guestCount < 100 && (
                  <p>
                    For orders between 30-100 guests: Available for tomorrow
                    after 7:00 PM
                  </p>
                )}
                {guestCount >= 100 && (
                  <p>
                    For orders over 100 guests: Available starting day after
                    tomorrow
                  </p>
                )}
              </div> */}

              {/* Staff and Tables Section */}
              {renderResourceInputs()}
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold mb-6">Order Summary</h2>

            {/* Selected Items */}
            <div className="mb-6 max-h-64 overflow-y-auto">
              <h3 className="font-semibold mb-2">Selected Items</h3>
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="text-left p-2 border-b font-medium text-gray-600 w-1/3">
                      Category
                    </th>
                    <th className="text-left p-2 border-b font-medium text-gray-600 w-2/3">
                      Items
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(groupedItems()).map(([category, items]) => (
                    <tr key={category} className="border-b last:border-b-0">
                      <td className="p-2 align-top font-medium text-gray-700">
                        {category}
                      </td>
                      <td className="p-2">
                        <div className="space-y-2">
                          {items.map((item, index) => (
                            <div
                              key={index}
                              className="flex justify-between text-sm items-center"
                            >
                              <span className="flex items-center gap-2">
                                {item.item_name}
                                {item.isExtra && (
                                  <span className="text-xs bg-orange-100 text-orange-600 px-2 py-0.5 rounded">
                                    Extra
                                  </span>
                                )}
                              </span>
                            </div>
                          ))}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Coupon Section */}
            <div className="mb-6">
              <h3 className="font-semibold mb-2">Apply Coupon</h3>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  placeholder="Enter coupon code"
                  className="flex-1 p-2 border rounded-md"
                  disabled={appliedCoupon !== null}
                />
                {appliedCoupon ? (
                  <button
                    onClick={removeCoupon}
                    className="px-4 py-2 bg-red-100 text-red-600 rounded-md hover:bg-red-200"
                  >
                    ✕
                  </button>
                ) : (
                  <button
                    onClick={handleCouponApply}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Apply
                  </button>
                )}
              </div>

              {couponError && (
                <div className="mt-2 p-3 bg-red-50 text-red-600 rounded-md flex items-center gap-2">
                  <span>⚠️</span>
                  <div>
                    <p className="font-semibold">Error</p>
                    <p>{couponError}</p>
                  </div>
                </div>
              )}

              {showCouponSuccess && (
                <div className="mt-2 p-3 bg-green-50 text-green-800 rounded-md flex items-center gap-2">
                  <span>✓</span>
                  <div>
                    <p className="font-semibold">Success</p>
                    <p>Coupon applied successfully!</p>
                  </div>
                </div>
              )}
            </div>

            {/* Price Breakdown */}
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>
                  Base Cost (₹{platePrice} × {guestCount})
                </span>
                <span>₹{totals.baseCost.toFixed(2)}</span>
              </div>

              {totals.extraItemsCost > 0 && (
                <div className="flex justify-between">
                  <span>Extra Items</span>
                  <span>₹{totals.extraItemsCost.toFixed(2)}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>Table Charges</span>
                <span>₹{totals.tablesCost.toFixed(2)}</span>
              </div>

              <div className="flex justify-between">
                <span>Staff Charges</span>
                <span>₹{totals.staffCost.toFixed(2)}</span>
              </div>

              <div className="flex justify-between">
                <span>Helper Charges</span>
                <span>₹{totals.helperCost.toFixed(2)}</span>
              </div>

              <div className="flex justify-between font-medium border-t">
                <span>Subtotal</span>
                <span>₹{totals.subtotal.toFixed(2)}</span>
              </div>

              {totals.discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount</span>
                  <span>-₹{totals.discount.toFixed(2)}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>GST ({gstPercentage}%)</span>
                <span>₹{totals.gst.toFixed(2)}</span>
              </div>

              <div className="flex justify-between">
                <span>
                  Delivery Fee {userDetails.city ? `(${userDetails.city})` : ""}
                </span>
                <span>₹{deliveryFee.toFixed(2)}</span>
              </div>

              <div className="flex justify-between text-lg font-bold pt-2 border-t">
                <span>Total</span>
                <span>₹{totals.total.toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={handleSubmit}
              className="w-full mt-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-300"
            >
              Proceed to Payment
            </button>
          </div>
        </div>
        {showPaymentSuccess && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-xl p-6 max-w-md w-full">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Payment Successful!
                </h3>
                <p className="text-gray-600 mb-6">
                  Thank you for your order. Our executive will call you shortly
                  for confirmation.
                </p>
                <button
                  onClick={() => {
                    setShowPaymentSuccess(false);
                    navigate("/");
                  }}
                  className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Back to Home
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Terms and Conditions */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">Terms and Conditions</h3>
          <div className="text-sm text-gray-600 space-y-2">
            <p>
              1. Orders must be placed at least{" "}
              {guestCount > 200
                ? "3 days"
                : guestCount > 100
                ? "2 days"
                : "1 day"}{" "}
              in advance.
            </p>
            <p>
              2. Cancellations within 24 hours of the event will incur a 50%
              charge.
            </p>
            <p>
              3. Changes to the order can be made up to 48 hours before the
              event.
            </p>
            <p>
              4. Delivery time may vary based on location and traffic
              conditions.
            </p>
            <p>
              5. Additional charges may apply for locations outside service
              area.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MenuOrder;
