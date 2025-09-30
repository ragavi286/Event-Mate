import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
    Home, Calendar as CalendarIcon, Users, Settings, LogOut, Package,
    Briefcase, Sparkles, Plus, ChevronLeft, ChevronRight, User, Mail, Lock,
    Clock, MapPin, DollarSign, ListChecks, CheckCheck, X, Search,
    Filter, Star, Phone, Globe, Info, Trash2, Edit, CalendarDays, Zap,
    Heart, Gift, Baby, GraduationCap
} from 'lucide-react';

// =======================================================================================
// --- CORE: CONSTANTS & MOCK DATA (Typically in Core/Constants.js) ----------------------
// =======================================================================================

const VIEWS = {
    LANDING: 'landing',
    AUTH: 'auth',
    DASHBOARD: 'dashboard',
    EVENTS_LIST: 'events_list',
    CALENDAR: 'calendar',
    EVENT_TYPES: 'event_types',
    CREATE_EVENT: 'create_event',
    VENDORS: 'vendors',
    MY_BOOKINGS: 'my_bookings',
    VENDOR_BOOKINGS: 'vendor_bookings',
    VENDOR_ONBOARDING: 'vendor_onboarding',
    VENDOR_SERVICES: 'vendor_services',
};

const USER_ROLES = {
    CLIENT: 'client',
    VENDOR: 'vendor',
};

const APP_NAME = "EventMate";
const VENDOR_TYPES = ["Venue", "Catering", "Photography", "Entertainment", "Decorations", "Other"];
const AMENITIES_LIST = ["AC", "Parking", "Projector", "WiFi", "Sound System", "Stage"];
const SERVICE_TYPES = ["Package", "Hourly Rate", "Fixed Fee"];
const CLIENT_DEMO_ID = 'demo_client_ranjeetha';
const VENDOR_DEMO_ID = 'demo_vendor_ranjeetha';

// Mock data structures
const initialDemoEvents = [
    { id: 1, title: 'My Birthday Party', type: 'Birthday Party', description: 'Celebrating turning the big 3-0!', location: 'Chennai', startTime: '2025-09-30T22:00', endTime: '2025-09-30T23:00', budget: 500, guests: 50, status: 'Pending', vendorId: 6, userId: CLIENT_DEMO_ID },
    { id: 2, title: 'Team Building Workshop', type: 'Corporate Event', description: 'Quarterly team strategy session.', location: 'Bangalore', startTime: '2025-10-15T09:00', endTime: '2025-10-15T17:00', budget: 1200, guests: 20, status: 'Completed', vendorId: null, userId: CLIENT_DEMO_ID },
    { id: 3, title: 'Annual Gala Night', type: 'Wedding', description: 'Major charity event.', location: 'Mumbai', startTime: '2025-11-20T18:00', endTime: '2025-11-20T23:59', budget: 5000, guests: 200, status: 'Pending', vendorId: null, userId: CLIENT_DEMO_ID },
];

let initialDemoVendors = [
    { id: 1, businessName: "The Grand Hall", businessType: "Venue", location: "Chennai", capacity: 200, budgetRange: "₹20,000 - ₹50,000", phone: "9876543210", email: "grand@hall.com", amenities: ["AC", "Parking"], rating: 4.5, userId: 'vendor_1' },
    { id: 6, businessName: "Ranjeetha's Catering", businessType: "Catering", location: "Chennai", capacity: 1000, budgetRange: "₹5,000 - ₹20,000", phone: "9876543211", email: "ranjeethademo@gmail.com", amenities: ["WiFi", "Projector"], rating: 4.8, userId: VENDOR_DEMO_ID },
    { id: 3, businessName: "Shutterbug Photos", businessType: "Photography", location: "Mumbai", capacity: 100, budgetRange: "₹10,000 - ₹30,000", phone: "9876543212", email: "shutter@bug.com", amenities: ["Stage"], rating: 4.2, userId: 'vendor_3' },
    { id: 4, businessName: "Music Makers DJ", businessType: "Entertainment", location: "Chennai", capacity: 500, budgetRange: "₹15,000 - ₹40,000", phone: "9876543213", email: "music@dj.com", amenities: ["Sound System"], rating: 4.9, userId: 'vendor_4' },
];

const initialDemoBookings = [
    { id: 101, eventId: 1, vendorId: 6, vendorName: "Ranjeetha's Catering", clientName: 'Ranjeetha M', clientEmail: 'ranjeethademo@gmail.com', clientPhone: '9428855637', eventTitle: 'My Birthday Party', date: '2025-09-30', location: 'Chennai', guests: 50, budget: 500, description: 'balloon', status: 'Pending' },
    { id: 102, eventId: 2, vendorId: 3, vendorName: "Shutterbug Photos", clientName: 'Demo Client', clientEmail: 'client@demo.com', clientPhone: '1234567890', eventTitle: 'Team Building Workshop', date: '2025-10-15', location: 'Bangalore', guests: 20, budget: 1200, description: 'Need full day coverage.', status: 'Accepted' },
    { id: 103, eventId: 1, vendorId: 4, vendorName: "Music Makers DJ", clientName: 'Ranjeetha M', clientEmail: 'ranjeethademo@gmail.com', clientPhone: '9428855637', eventTitle: 'My Birthday Party', date: '2025-09-30', location: 'Chennai', guests: 50, budget: 500, description: 'Need a good playlist.', status: 'Pending' },
];

let initialDemoServices = [
    { id: 1, userId: VENDOR_DEMO_ID, name: "Gourmet Catering Menu (Gold)", type: "Package", price: 50, description: "Per person cost. Includes appetizer, main course (2 proteins), and dessert." },
    { id: 2, userId: VENDOR_DEMO_ID, name: "Standard Catering Package", type: "Package", price: 35, description: "Per person cost. Buffet style, one protein, basic drinks." },
    { id: 3, userId: 'vendor_1', name: "Venue Deluxe Package", type: "Package", price: 3000, description: "8 hours rental, seating for 150, basic lighting and sound system." },
];

// --- Mock API Call Utility ---
const mockApiCall = (data, success = true, delay = 500) => new Promise((resolve, reject) => {
    setTimeout(() => {
        if (success) {
            resolve(data);
        } else {
            reject({ message: "API Error: Could not complete request." });
        }
    }, delay);
});

// =======================================================================================
// --- COMPONENTS/UI (Typically in Components/UI/Index.jsx) ------------------------------
// =======================================================================================

const Card = ({ children, className = '' }) => (
    <div className={`p-6 bg-white rounded-xl shadow-lg ${className}`}>
        {children}
    </div>
);

const Button = ({ children, onClick, variant = 'primary', size = 'md', className = '', disabled = false, type = 'button' }) => {
    const baseStyle = 'font-semibold rounded-lg transition-all duration-200 focus:outline-none focus:ring-4';
    const variantStyles = {
        primary: 'bg-indigo-600 hover:bg-indigo-700 text-white focus:ring-indigo-300 shadow-md',
        secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-800 focus:ring-gray-300',
        danger: 'bg-red-500 hover:bg-red-600 text-white focus:ring-red-300',
        success: 'bg-emerald-500 hover:bg-emerald-600 text-white focus:ring-emerald-300',
        ghost: 'bg-transparent hover:bg-gray-100 text-indigo-600 focus:ring-transparent'
    };
    const sizeStyles = {
        sm: 'py-2 px-3 text-sm',
        md: 'py-2 px-4 text-base',
        lg: 'py-3 px-6 text-lg',
    };

    return (
        <button
            type={type}
            onClick={onClick}
            className={`${baseStyle} ${variantStyles[variant]} ${sizeStyles[size]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
            disabled={disabled}
        >
            {children}
        </button>
    );
};

const InputField = ({ label, type = 'text', value, onChange, placeholder, required = false, icon: Icon, name, disabled = false }) => (
    <div className="space-y-1">
        <label className="text-sm font-medium text-gray-700 block">
            {label} {required && <span className="text-red-500">*</span>}
        </label>
        <div className="relative">
            {Icon && <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />}
            <input
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                required={required}
                disabled={disabled}
                className={`w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ${Icon ? 'pl-10' : 'pl-4'} ${disabled ? 'bg-gray-100' : 'bg-white'}`}
            />
        </div>
    </div>
);

const SelectField = ({ label, value, onChange, options, required = false, name }) => (
    <div className="space-y-1">
        <label className="text-sm font-medium text-gray-700 block">
            {label} {required && <span className="text-red-500">*</span>}
        </label>
        <select
            name={name}
            value={value}
            onChange={onChange}
            required={required}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 appearance-none bg-white pr-8"
        >
            {options.map((opt, index) => (
                <option key={index} value={opt.value || opt}>{opt.label || opt}</option>
            ))}
        </select>
    </div>
);

const StatCard = ({ title, value, description, icon: Icon, color }) => (
    <Card className="flex items-center p-4">
        <div className={`p-3 rounded-full ${color} bg-opacity-20 mr-4`}>
            <Icon className={`w-6 h-6 ${color.replace('bg-', 'text-')}`} />
        </div>
        <div>
            <div className="text-3xl font-bold text-gray-800">{value}</div>
            <div className="text-sm text-gray-500">{title}</div>
        </div>
    </Card>
);

const StatusPill = ({ status }) => {
    let colorClass;
    let text;
    switch (status) {
        case 'Pending':
            colorClass = 'bg-yellow-100 text-yellow-800';
            text = 'Pending';
            break;
        case 'Accepted':
            colorClass = 'bg-emerald-100 text-emerald-800';
            text = 'Accepted';
            break;
        case 'Rejected':
            colorClass = 'bg-red-100 text-red-800';
            text = 'Rejected';
            break;
        case 'Completed':
            colorClass = 'bg-indigo-100 text-indigo-800';
            text = 'Completed';
            break;
        case 'Catering':
            colorClass = 'bg-purple-100 text-purple-800';
            text = 'Catering';
            break;
        case 'Venue':
            colorClass = 'bg-cyan-100 text-cyan-800';
            text = 'Venue';
            break;
        case 'Photography':
            colorClass = 'bg-pink-100 text-pink-800';
            text = 'Photography';
            break;
        default:
            colorClass = 'bg-gray-100 text-gray-800';
            text = status;
    }
    return (
        <span className={`text-xs font-semibold px-3 py-1 rounded-full ${colorClass}`}>
            {text}
        </span>
    );
};


// =======================================================================================
// --- COMPONENTS/SHARED (Typically in Components/Shared/...) ----------------------------
// =======================================================================================

const EventDetailCard = ({ event, onEdit, onDelete }) => (
    <Card className="flex flex-col md:flex-row justify-between items-start md:items-center p-4 mb-4 hover:shadow-xl transition duration-300">
        <div className="flex-1 min-w-0 mb-4 md:mb-0">
            <h3 className="text-lg font-semibold text-gray-800 truncate">{event.title}</h3>
            <p className="text-sm text-indigo-600 mb-2">{event.type}</p>
            <div className="flex flex-wrap items-center text-sm text-gray-500 space-x-4">
                <div className="flex items-center">
                    <CalendarDays className="w-4 h-4 mr-1 text-gray-400" />
                    {new Date(event.startTime).toLocaleDateString()}
                    , {new Date(event.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
                <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-1 text-gray-400" />
                    {event.location}
                </div>
                {event.budget > 0 && (
                    <div className="flex items-center">
                        <DollarSign className="w-4 h-4 mr-1 text-gray-400" />
                        ${event.budget}
                    </div>
                )}
            </div>
            <p className="text-xs text-gray-400 mt-1 truncate">{event.description}</p>
        </div>
        <div className="flex items-center space-x-3">
            <StatusPill status={event.status} />
            <Button variant="ghost" size="sm" onClick={() => onEdit(event)}>
                <Edit className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="sm" onClick={() => onDelete(event.id)}>
                <Trash2 className="w-5 h-5 text-red-500" />
            </Button>
        </div>
    </Card>
);

const BookingCard = ({ booking, role, onAction }) => {
    const isVendor = role === USER_ROLES.VENDOR;
    let statusClass;
    switch (booking.status) {
        case 'Pending': statusClass = 'border-l-4 border-yellow-500'; break;
        case 'Accepted': statusClass = 'border-l-4 border-emerald-500'; break;
        case 'Rejected': statusClass = 'border-l-4 border-red-500'; break;
        default: statusClass = 'border-l-4 border-gray-300';
    }

    return (
        <Card className={`p-4 mb-4 ${statusClass}`}>
            <div className="flex justify-between items-start mb-2">
                <h3 className="text-xl font-bold text-gray-800">{booking.eventTitle}</h3>
                <StatusPill status={booking.status} />
            </div>
            <div className="text-sm text-gray-600 space-y-1">
                {isVendor ? (
                    <>
                        <p><span className="font-medium">Client:</span> {booking.clientName}</p>
                        <p className="flex items-center"><Phone className="w-4 h-4 mr-1 text-gray-400" />{booking.clientPhone}</p>
                        <p className="flex items-center"><Mail className="w-4 h-4 mr-1 text-gray-400" />{booking.clientEmail}</p>
                    </>
                ) : (
                    <p><span className="font-medium">Vendor:</span> {booking.vendorName}</p>
                )}
                <div className="flex flex-wrap items-center space-x-4 pt-2 border-t mt-2">
                    <div className="flex items-center"><CalendarDays className="w-4 h-4 mr-1 text-gray-400" />{booking.date}</div>
                    <div className="flex items-center"><MapPin className="w-4 h-4 mr-1 text-gray-400" />{booking.location}</div>
                    <div className="flex items-center"><Users className="w-4 h-4 mr-1 text-gray-400" />{booking.guests} guests</div>
                    <div className="flex items-center"><DollarSign className="w-4 h-4 mr-1 text-gray-400" />Budget: ${booking.budget}</div>
                </div>
                <p className="mt-2 text-xs italic">Description: {booking.description}</p>
            </div>

            {isVendor && booking.status === 'Pending' && (
                <div className="mt-4 flex space-x-3 justify-end">
                    <Button variant="success" size="sm" onClick={() => onAction(booking.id, 'Accepted')}>Accept</Button>
                    <Button variant="danger" size="sm" onClick={() => onAction(booking.id, 'Rejected')}>Reject</Button>
                </div>
            )}
        </Card>
    );
};

const VendorCard = ({ vendor, onBook }) => (
    <Card className="p-4 flex flex-col justify-between hover:shadow-xl transition duration-300">
        <div className="flex items-center mb-3">
            <Briefcase className="w-6 h-6 text-indigo-500 mr-3" />
            <h3 className="text-xl font-semibold text-gray-800">{vendor.businessName}</h3>
        </div>
        <div className="space-y-1 text-sm text-gray-600 mb-4">
            <StatusPill status={vendor.businessType} />
            <p className="flex items-center"><MapPin className="w-4 h-4 mr-1 text-gray-400" />{vendor.location}</p>
            <p className="flex items-center"><Users className="w-4 h-4 mr-1 text-gray-400" /> Capacity: {vendor.capacity}+ guests</p>
            <p className="flex items-center"><Star className="w-4 h-4 mr-1 text-yellow-500" fill="currentColor" /> Rating: {vendor.rating}</p>
        </div>
        <div className="flex flex-wrap gap-1 mb-4">
            {vendor.amenities.map(a => (
                <span key={a} className="text-xs px-2 py-1 bg-gray-100 rounded-full text-gray-500">{a}</span>
            ))}
        </div>
        <Button onClick={() => onBook(vendor)} size="sm" className="w-full">
            Book Service
        </Button>
    </Card>
);

const ServiceCard = ({ service, onEdit, onDelete }) => (
    <Card className="flex justify-between items-center p-4 mb-4">
        <div>
            <h3 className="text-lg font-semibold text-gray-800">{service.name}</h3>
            <div className="flex items-center text-sm text-gray-500 mt-1">
                <DollarSign className="w-4 h-4 mr-1" />
                ${service.price} &bull; <StatusPill status={service.type} />
            </div>
            <p className="text-xs text-gray-400 mt-1 italic">{service.description}</p>
        </div>
        <div className="flex space-x-2">
            <Button variant="ghost" size="sm" onClick={() => onEdit(service.id)}>
                <Edit className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="sm" onClick={() => onDelete(service.id)}>
                <Trash2 className="w-5 h-5 text-red-500" />
            </Button>
        </div>
    </Card>
);

const EventTypeCard = ({ type, description, icon: Icon, color, onSelect }) => (
    <Card className="text-center hover:shadow-2xl transition duration-300 transform hover:-translate-y-1">
        <div className={`mx-auto w-16 h-16 rounded-xl flex items-center justify-center mb-4 ${color} bg-opacity-80`}>
            <Icon className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-lg font-semibold text-gray-800">{type}</h3>
        <p className="text-sm text-gray-500 mb-4">{description}</p>
        <Button variant="primary" size="sm" onClick={() => onSelect(type)}>
            Select
        </Button>
    </Card>
);


// =======================================================================================
// --- VIEWS (Typically in Views/...) ----------------------------------------------------
// =======================================================================================

const LandingPageView = ({ setView, setUserRole }) => {
    const handleRoleSelect = (role) => {
        setUserRole(role);
        setView(VIEWS.AUTH);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600 flex flex-col">
            <header className="flex justify-between items-center p-4 text-white">
                <div className="flex items-center text-xl font-bold">
                    <Sparkles className="w-6 h-6 mr-2" />
                    {APP_NAME}
                </div>
                <div className="space-x-4">
                    <Button variant="ghost" className="text-white hover:bg-white hover:text-indigo-600" onClick={() => handleRoleSelect(USER_ROLES.CLIENT)}>
                        Sign In
                    </Button>
                    <Button variant="secondary" className="bg-white text-indigo-600 hover:bg-gray-100" onClick={() => handleRoleSelect(USER_ROLES.CLIENT)}>
                        Get Started
                    </Button>
                </div>
            </header>

            <main className="flex-1 flex flex-col justify-center items-center p-6 text-white text-center">
                <h1 className="text-5xl md:text-6xl font-extrabold mb-4">
                    Plan Your Perfect Event
                </h1>
                <p className="text-xl mb-12 max-w-2xl opacity-80">
                    Connect with amazing vendors and create unforgettable experiences for any occasion
                </p>

                <div className="flex flex-col md:flex-row space-y-6 md:space-y-0 md:space-x-12">
                    <Card className="bg-white bg-opacity-10 backdrop-blur-sm w-80 p-8 flex flex-col items-center border border-white/20 text-white">
                        <User className="w-16 h-16 text-white mb-4" />
                        <h2 className="text-2xl font-semibold mb-2">I'm a Client</h2>
                        <p className="text-sm opacity-70 mb-6">Book events and find vendors</p>
                        <Button variant="secondary" className="bg-indigo-600 hover:bg-indigo-700 text-white" onClick={() => handleRoleSelect(USER_ROLES.CLIENT)}>
                            Get Started
                        </Button>
                    </Card>

                    <Card className="bg-white bg-opacity-10 backdrop-blur-sm w-80 p-8 flex flex-col items-center border border-white/20 text-white">
                        <Briefcase className="w-16 h-16 text-white mb-4" />
                        <h2 className="text-2xl font-semibold mb-2">I'm a Vendor</h2>
                        <p className="text-sm opacity-70 mb-6">Offer services and manage bookings</p>
                        <Button variant="success" className="bg-emerald-500 hover:bg-emerald-600 text-white" onClick={() => handleRoleSelect(USER_ROLES.VENDOR)}>
                            Join as Vendor
                        </Button>
                    </Card>
                </div>
            </main>
        </div>
    );
};

const AuthView = ({ setView, setUserRole, setUserId, userRole, setVendorProfile }) => {
    const [isSignIn, setIsSignIn] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [role, setRole] = useState(userRole || USER_ROLES.CLIENT);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleAuth = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        const url = isSignIn
            ? 'http://localhost:8080/api/auth/login'
            : 'http://localhost:8080/api/auth/register';

        const payload = isSignIn
            ? { email, password }
            : { name, email, password, role };

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const errorData = await response.text();
                throw new Error(errorData || 'An error occurred.');
            }

            if (isSignIn) {
                const data = await response.json();
                // In a real app, you would decode the token to get the real user ID and role
                // For this demo, we are mocking this process.
                const mockUserId = email.toLowerCase().includes('vendor') ? VENDOR_DEMO_ID : CLIENT_DEMO_ID;
                const mockUserRole = email.toLowerCase().includes('vendor') ? USER_ROLES.VENDOR : USER_ROLES.CLIENT;
                
                setUserId(mockUserId);
                setUserRole(mockUserRole);
                // No need to call setView here, the useEffect in App will handle redirection.

            } else {
                // Automatically switch to login view after successful registration
                alert('Registration successful! Please sign in.');
                setIsSignIn(true);
            }

        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDemoLogin = (demoRole, demoId) => {
        setUserRole(demoRole);
        setUserId(demoId);
        if (demoRole === USER_ROLES.VENDOR) {
            // Mock onboarded vendor for seamless dashboard access
            setVendorProfile(p => ({ ...p, userId: demoId, isComplete: true }));
        }
        // No need to setView here, the useEffect in App will handle redirection.
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
            <Card className="max-w-md w-full p-8 text-center">
                <div className="flex justify-center mb-6">
                    <Sparkles className="w-8 h-8 text-indigo-600" />
                </div>
                <h2 className="text-3xl font-bold mb-2">
                    {isSignIn ? 'Welcome back' : 'Create Account'}
                </h2>
                <p className="text-gray-500 mb-6">
                    {isSignIn ? 'Sign in to your EventMate account' : 'Start planning your perfect event'}
                </p>

                {error && <p className="text-red-100 text-red-700 p-2 rounded">{error}</p>}

                <form onSubmit={handleAuth} className="space-y-4">
                    {!isSignIn && (
                        <InputField
                            label="Full Name"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Ranjeetha M"
                            required
                            icon={User}
                        />
                    )}
                    <InputField
                        label="Email address"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="ranjeethademo@gmail.com"
                        required
                        icon={Mail}
                    />
                    <InputField
                        label="Password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        required
                        icon={Lock}
                    />

                    {!isSignIn && (
                        <SelectField
                            label="I am signing up as a..."
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            options={[
                                { value: USER_ROLES.CLIENT, label: 'Client (Planner)' },
                                { value: USER_ROLES.VENDOR, label: 'Vendor (Service Provider)' },
                            ]}
                            required
                        />
                    )}

                    <Button type="submit" size="lg" className="w-full mt-6" disabled={isLoading}>
                        {isLoading ? 'Processing...' : (isSignIn ? 'Sign In' : 'Sign Up')}
                    </Button>
                </form>

                <div className="mt-4 text-sm">
                    {isSignIn ? (
                         <p>
                            Don't have an account?{' '}
                            <button onClick={() => setIsSignIn(false)} className="font-medium text-indigo-600 hover:underline">
                                Sign Up
                            </button>
                        </p>
                    ) : (
                        <p>
                            Already have an account?{' '}
                            <button onClick={() => setIsSignIn(true)} className="font-medium text-indigo-600 hover:underline">
                                Sign In
                            </button>
                        </p>
                    )}

                    <p className="mt-4 text-gray-500">
                        <button onClick={() => setView(VIEWS.LANDING)} className="text-sm text-gray-500 hover:text-indigo-600 transition">
                            &larr; Back to home
                        </button>
                    </p>
                </div>
                <div className="mt-8 pt-4 border-t border-gray-100">
                    <h3 className="text-sm font-semibold text-gray-600 mb-3">Demo Accounts</h3>
                    <div className="flex space-x-3 justify-center">
                        <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => handleDemoLogin(USER_ROLES.CLIENT, CLIENT_DEMO_ID)}
                        >
                            Client Demo
                        </Button>
                        <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => handleDemoLogin(USER_ROLES.VENDOR, VENDOR_DEMO_ID)}
                        >
                            Vendor Demo
                        </Button>
                    </div>
                </div>
            </Card>
        </div>
    );
};

// --- VendorOnboardingView (Views/VendorOnboardingView.jsx) ---
const VendorOnboardingView = ({ setView, userId, setVendorProfile }) => {
    const [form, setForm] = useState({
        businessName: '',
        businessType: '',
        location: '',
        capacity: 0,
        budgetRange: '',
        phone: '',
        email: '',
        amenities: [],
    });

    const handleChange = (e) => {
        const { name, value, type } = e.target;
        setForm(prev => ({ ...prev, [name]: type === 'number' ? parseFloat(value) || 0 : value }));
    };

    const handleAmenityChange = (amenity) => {
        setForm(prev => {
            const newAmenities = prev.amenities.includes(amenity)
                ? prev.amenities.filter(a => a !== amenity)
                : [...prev.amenities, amenity];
            return { ...prev, amenities: newAmenities };
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const newProfile = { id: Date.now(), ...form, userId, isComplete: true, rating: 0 };
        setVendorProfile(newProfile);
        initialDemoVendors.push(newProfile);
        // No need to setView here, the useEffect in App will handle redirection.
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6 flex justify-center">
            <Card className="max-w-3xl w-full">
                <h1 className="text-3xl font-bold mb-2 text-center text-gray-800">Vendor Information</h1>
                <p className="text-center text-gray-500 mb-8">Please complete your profile to start receiving booking requests.</p>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <InputField label="Business Name" name="businessName" value={form.businessName} onChange={handleChange} placeholder="The Grand Hall" required />
                        <SelectField
                            label="Business Type"
                            name="businessType"
                            value={form.businessType}
                            onChange={handleChange}
                            options={[{ label: "Select...", value: "" }, ...VENDOR_TYPES]}
                            required
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <InputField label="Location" name="location" value={form.location} onChange={handleChange} placeholder="City / Address" required icon={MapPin} />
                        <InputField label="Capacity" name="capacity" type="number" value={form.capacity} onChange={handleChange} placeholder="No. of Guests" required />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <InputField label="Phone" name="phone" type="tel" value={form.phone} onChange={handleChange} placeholder="+91-XXXXXXXXXX" required icon={Phone} />
                        <InputField label="Email" name="email" type="email" value={form.email} onChange={handleChange} placeholder="your@email.com" required icon={Mail} />
                    </div>

                    <InputField label="Budget Range" name="budgetRange" value={form.budgetRange} onChange={handleChange} placeholder="e.g., ₹20,000 - ₹50,000" />

                    <div>
                        <label className="text-sm font-medium text-gray-700 block mb-2">
                            Amenities
                        </label>
                        <div className="flex flex-wrap gap-2">
                            {AMENITIES_LIST.map(amenity => (
                                <button
                                    key={amenity}
                                    type="button"
                                    onClick={() => handleAmenityChange(amenity)}
                                    className={`py-2 px-4 text-sm rounded-full transition duration-150 ${form.amenities.includes(amenity)
                                        ? 'bg-indigo-600 text-white shadow-md'
                                        : 'bg-gray-100 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 border border-gray-200'
                                        }`}
                                >
                                    {amenity}
                                </button>
                            ))}
                        </div>
                        <p className="text-xs text-gray-400 mt-1 italic">AC, Parking, Projector...</p>
                    </div>

                    <div className="pt-4 flex justify-end space-x-4">
                        <Button type="button" variant="secondary" onClick={() => setView(VIEWS.DASHBOARD)}>Cancel</Button>
                        <Button type="submit" variant="primary">Save & Continue</Button>
                    </div>
                </form>
            </Card>
        </div>
    );
};

const ClientDashboardView = ({ events, setView, setSelectedEventId }) => {
    const userEvents = events.filter(e => e.userId === CLIENT_DEMO_ID);
    const upcomingEvents = userEvents.filter(e => new Date(e.startTime) > new Date()).slice(0, 3);
    const totalEvents = userEvents.length;
    const completedEvents = userEvents.filter(e => e.status === 'Completed').length;
    const upcomingCount = userEvents.filter(e => new Date(e.startTime) > new Date() && new Date(e.startTime) < new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)).length;

    const handleCreateEvent = () => setView(VIEWS.EVENT_TYPES);
    const handleEditEvent = (event) => {
        setSelectedEventId(event.id);
        setView(VIEWS.CREATE_EVENT);
    };
    const handleDeleteEvent = (id) => {
        console.log('Deleting event:', id);
    };

    return (
        <div className="p-6 space-y-8">
            <header className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-800">Welcome back, Ranjeetha!</h1>
                <Button onClick={handleCreateEvent} className="flex items-center">
                    <Plus className="w-5 h-5 mr-1" /> New Event
                </Button>
            </header>
            <p className="text-gray-500">You have {userEvents.length} upcoming events. Stay organized with {APP_NAME}.</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard title="Total Events" value={totalEvents} description="All your events" icon={ListChecks} color="bg-indigo-600" />
                <StatCard title="Upcoming Events" value={upcomingCount} description="Events in next 30 days" icon={Clock} color="bg-red-500" />
                <StatCard title="Completed" value={completedEvents} description="Successfully completed" icon={CheckCheck} color="bg-emerald-500" />
            </div>

            <div className="pt-4">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-semibold text-gray-800">Upcoming Events</h2>
                    <Button onClick={handleCreateEvent} size="sm" className="flex items-center">
                        <Plus className="w-4 h-4 mr-1" /> Create Event
                    </Button>
                </div>
                <div className="space-y-4">
                    {upcomingEvents.length > 0 ? (
                        upcomingEvents.map(event => (
                            <EventDetailCard
                                key={event.id}
                                event={event}
                                onEdit={handleEditEvent}
                                onDelete={handleDeleteEvent}
                            />
                        ))
                    ) : (
                        <Card className="text-center py-12 text-gray-500">
                            <Zap className="w-8 h-8 mx-auto mb-3 text-indigo-400" />
                            <p className="font-semibold">No upcoming events!</p>
                            <p className="text-sm">Start planning your next big occasion.</p>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
};

const VendorDashboardView = ({ bookings, vendorProfile, setBookings }) => {
    const currentVendor = initialDemoVendors.find(v => v.userId === vendorProfile?.userId) || {};
    const vendorBookings = bookings.filter(b => b.vendorId === currentVendor.id);
    const totalBookings = vendorBookings.length;
    const pendingBookings = vendorBookings.filter(b => b.status === 'Pending').length;
    const acceptedBookings = vendorBookings.filter(b => b.status === 'Accepted').length;

    const handleBookingAction = async (bookingId, newStatus) => {
        try {
            await mockApiCall({ success: true }, true);
            setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status: newStatus } : b));
            console.log(`Booking ${bookingId} set to ${newStatus}`);
        } catch (error) {
            console.error("Failed to update booking status:", error);
        }
    };

    return (
        <div className="p-6 space-y-8">
            <header className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-800">Welcome, {currentVendor.businessName || 'Vendor'}!</h1>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard title="Total Bookings" value={totalBookings} description="Received all time" icon={ListChecks} color="bg-indigo-600" />
                <StatCard title="Pending Requests" value={pendingBookings} description="Awaiting your response" icon={Clock} color="bg-yellow-500" />
                <StatCard title="Confirmed Bookings" value={acceptedBookings} description="In your pipeline" icon={CheckCheck} color="bg-emerald-500" />
            </div>

            <div className="pt-4">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Recent Bookings ({pendingBookings})</h2>

                <div className="space-y-4">
                    {vendorBookings.filter(b => b.status === 'Pending').length > 0 ? (
                        vendorBookings.filter(b => b.status === 'Pending').map(booking => (
                            <BookingCard
                                key={booking.id}
                                booking={booking}
                                role={USER_ROLES.VENDOR}
                                onAction={handleBookingAction}
                            />
                        ))
                    ) : (
                        <Card className="text-center py-12 text-gray-500">
                            <CheckCheck className="w-8 h-8 mx-auto mb-3 text-emerald-400" />
                            <p className="font-semibold">All clear!</p>
                            <p className="text-sm">You have no pending booking requests.</p>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
};

const VendorBookingsView = ({ bookings, vendorProfile, setBookings }) => {
    const currentVendor = initialDemoVendors.find(v => v.userId === vendorProfile?.userId) || {};
    const vendorBookings = bookings.filter(b => b.vendorId === currentVendor.id);
    const [filterStatus, setFilterStatus] = useState('All');

    const filteredBookings = vendorBookings.filter(b => filterStatus === 'All' || b.status === filterStatus);

    const handleBookingAction = async (bookingId, newStatus) => {
        try {
            await mockApiCall({ success: true }, true);
            setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status: newStatus } : b));
            console.log(`Booking ${bookingId} set to ${newStatus}`);
        } catch (error) {
            console.error("Failed to update booking status:", error);
        }
    };

    return (
        <div className="p-6 space-y-8">
            <header className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-800">All Bookings ({vendorBookings.length})</h1>
            </header>
            <p className="text-gray-500">Review and manage all client requests for your services.</p>

            <div className="flex space-x-4">
                {['All', 'Pending', 'Accepted', 'Rejected'].map(status => (
                    <Button
                        key={status}
                        variant={filterStatus === status ? 'primary' : 'secondary'}
                        size="sm"
                        onClick={() => setFilterStatus(status)}
                    >
                        {status} ({vendorBookings.filter(b => status === 'All' ? true : b.status === status).length})
                    </Button>
                ))}
            </div>

            <div className="space-y-4">
                {filteredBookings.length > 0 ? (
                    filteredBookings.map(booking => (
                        <BookingCard
                            key={booking.id}
                            booking={booking}
                            role={USER_ROLES.VENDOR}
                            onAction={handleBookingAction}
                        />
                    ))
                ) : (
                    <Card className="text-center py-12 text-gray-500">
                        <Info className="w-8 h-8 mx-auto mb-3 text-gray-400" />
                        <p className="font-semibold">No bookings found</p>
                        <p className="text-sm">Adjust your filters or wait for new requests!</p>
                    </Card>
                )}
            </div>
        </div>
    );
};

const VendorMyServicesView = ({ userId, services, setServices }) => {
    const currentVendorProfile = initialDemoVendors.find(v => v.userId === userId);

    if (!currentVendorProfile) {
        return (
            <div className="p-6">
                <Card className="text-center py-12 text-red-500">
                    <Info className="w-8 h-8 mx-auto mb-3" />
                    <p className="font-semibold">Vendor Profile Missing</p>
                    <p className="text-sm">Please complete the onboarding form first.</p>
                </Card>
            </div>
        );
    }

    const vendorServices = services.filter(s => s.userId === userId);
    const [isAdding, setIsAdding] = useState(false);
    const [serviceForm, setServiceForm] = useState({
        name: '',
        type: SERVICE_TYPES[0],
        price: '',
        description: '',
    });

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setServiceForm(prev => ({ ...prev, [name]: value }));
    };

    const handleAddService = (e) => {
        e.preventDefault();
        const newService = {
            id: Date.now(),
            userId,
            ...serviceForm,
            price: parseFloat(serviceForm.price) || 0,
        };
        initialDemoServices.push(newService);
        setServices([...initialDemoServices]); 
        setIsAdding(false);
        setServiceForm({ name: '', type: SERVICE_TYPES[0], price: '', description: '' });
    };

    const handleDeleteService = (id) => {
        initialDemoServices = initialDemoServices.filter(s => s.id !== id);
        setServices([...initialDemoServices]);
        console.log("Deleted service:", id);
    };

    return (
        <div className="p-6 space-y-8">
            <header className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-800">My Services & Packages</h1>
                <Button onClick={() => setIsAdding(true)} className="flex items-center">
                    <Plus className="w-5 h-5 mr-1" /> Add New Service
                </Button>
            </header>
            <p className="text-gray-500">Manage the services you offer to clients.</p>

            {isAdding && (
                <Card className="mb-8 border border-indigo-200">
                    <h2 className="text-xl font-semibold mb-4">Add New Service</h2>
                    <form onSubmit={handleAddService} className="space-y-4">
                        <InputField label="Service Name" name="name" value={serviceForm.name} onChange={handleFormChange} required />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <SelectField
                                label="Pricing Type"
                                name="type"
                                value={serviceForm.type}
                                onChange={handleFormChange}
                                options={SERVICE_TYPES}
                                required
                            />
                            <InputField label="Price ($)" name="price" type="number" value={serviceForm.price} onChange={handleFormChange} required />
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-700 block">Description</label>
                            <textarea
                                name="description"
                                value={serviceForm.description}
                                onChange={handleFormChange}
                                rows="3"
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
                                placeholder="Detail what is included in this service..."
                            />
                        </div>
                        <div className="flex justify-end space-x-4">
                            <Button type="button" variant="secondary" onClick={() => setIsAdding(false)}>Cancel</Button>
                            <Button type="submit" variant="primary">Save Service</Button>
                        </div>
                    </form>
                </Card>
            )}

            <div className="space-y-4">
                {vendorServices.length > 0 ? (
                    vendorServices.map(service => (
                        <ServiceCard
                            key={service.id}
                            service={service}
                            onEdit={() => console.log('Edit service:', service.id)}
                            onDelete={handleDeleteService}
                        />
                    ))
                ) : (
                    <Card className="text-center py-12 text-gray-500">
                        <Package className="w-8 h-8 mx-auto mb-3 text-indigo-400" />
                        <p className="font-semibold">No services defined</p>
                        <p className="text-sm">Click "Add New Service" to start listing your offerings!</p>
                    </Card>
                )}
            </div>
        </div>
    );
};

const EventsListView = ({ events, setView, setSelectedEventId }) => {
    const userEvents = events.filter(e => e.userId === CLIENT_DEMO_ID); 
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('All');

    const filteredEvents = userEvents.filter(event => {
        const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            event.location.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType = filterType === 'All' || event.type === filterType;
        return matchesSearch && matchesType;
    });

    const handleEditEvent = (event) => {
        setSelectedEventId(event.id);
        setView(VIEWS.CREATE_EVENT);
    };
    const handleDeleteEvent = (id) => {
        console.log('Deleting event:', id);
    };

    const allEventTypes = useMemo(() => {
        const types = [...new Set(initialDemoEvents.map(e => e.type))];
        return ['All', ...types];
    }, []);

    return (
        <div className="p-6 space-y-6">
            <header className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-800">My Events ({userEvents.length})</h1>
                <Button onClick={() => setView(VIEWS.EVENT_TYPES)} className="flex items-center">
                    <Plus className="w-5 h-5 mr-1" /> Create Event
                </Button>
            </header>

            <Card className="p-4 flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 items-center">
                <div className="flex-1 w-full relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search by title, description, or location..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 pl-10"
                    />
                </div>
                <SelectField
                    label="Type"
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    options={allEventTypes.map(type => ({ label: type, value: type }))}
                    name="filterType"
                    className="w-full md:w-auto"
                />
            </Card>

            <div className="space-y-4 pt-2">
                {filteredEvents.length > 0 ? (
                    filteredEvents.map(event => (
                        <EventDetailCard
                            key={event.id}
                            event={event}
                            onEdit={handleEditEvent}
                            onDelete={handleDeleteEvent}
                        />
                    ))
                ) : (
                    <Card className="text-center py-12 text-gray-500">
                        <Filter className="w-8 h-8 mx-auto mb-3 text-red-400" />
                        <p className="font-semibold">No events match your criteria.</p>
                        <p className="text-sm">Try broadening your search or creating a new event!</p>
                    </Card>
                )}
            </div>
        </div>
    );
};

const EventTypesView = ({ setView, setSelectedEventType, setSelectedEventId }) => {
    const eventTypes = [
        { type: "Birthday Party", description: "Plan your perfect birthday party", icon: Zap, color: "bg-red-500" },
        { type: "Wedding", description: "Plan your perfect wedding", icon: Heart, color: "bg-cyan-500" },
        { type: "Corporate Event", description: "Plan your perfect corporate event", icon: Briefcase, color: "bg-blue-500" },
        { type: "Anniversary", description: "Plan your perfect anniversary", icon: Gift, color: "bg-yellow-500" },
        { type: "Baby Shower", description: "Plan your perfect baby shower", icon: Baby, color: "bg-purple-500" },
        { type: "Graduation", description: "Plan your perfect graduation", icon: GraduationCap, color: "bg-emerald-500" },
    ];

    const handleSelectType = (type) => {
        setSelectedEventType(type);
        setSelectedEventId(null); 
        setView(VIEWS.CREATE_EVENT);
    };

    return (
        <div className="p-6 space-y-6">
            <Button variant="ghost" className="!p-0 text-gray-600 hover:text-indigo-600" onClick={() => setView(VIEWS.DASHBOARD)}>
                <ChevronLeft className="w-5 h-5 mr-1" /> Back
            </Button>
            <h1 className="text-3xl font-bold text-gray-800">Event Types</h1>
            <p className="text-gray-500">Select the type of event you would like to plan.</p>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
                {eventTypes.map(event => (
                    <EventTypeCard
                        key={event.type}
                        {...event}
                        onSelect={handleSelectType}
                    />
                ))}
            </div>
        </div>
    );
};

const CreateEventForm = ({ setView, events, selectedEventId, selectedEventType, setEvents }) => {
    const isEdit = !!selectedEventId;
    const initialEvent = isEdit ? events.find(e => e.id === selectedEventId) : {};

    const [form, setForm] = useState({
        title: initialEvent.title || `My ${selectedEventType || 'Event'}`,
        type: initialEvent.type || selectedEventType || 'General Event',
        description: initialEvent.description || '',
        startTime: initialEvent.startTime || new Date().toISOString().slice(0, 16),
        endTime: initialEvent.endTime || new Date(Date.now() + 60 * 60 * 1000).toISOString().slice(0, 16),
        location: initialEvent.location || '',
        budget: initialEvent.budget || 0,
        guests: initialEvent.guests || 0,
    });

    const handleChange = (e) => {
        const { name, value, type } = e.target;
        setForm(prev => ({
            ...prev,
            [name]: type === 'number' ? parseFloat(value) || 0 : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await mockApiCall({ success: true, event: form }, true);

            if (isEdit) {
                setEvents(prev => prev.map(e => e.id === selectedEventId ? { ...e, ...form } : e));
            } else {
                const newEvent = { ...form, id: Date.now(), userId: CLIENT_DEMO_ID, status: 'Pending' };
                initialDemoEvents.push(newEvent);
                setEvents(prev => [...prev, newEvent]);
            }

            console.log(`Event ${isEdit ? 'updated' : 'created'} successfully:`, form);
            setView(VIEWS.DASHBOARD);
        } catch (error) {
            console.error('Failed to save event:', error);
        }
    };

    return (
        <div className="p-6 space-y-6">
            <Button variant="ghost" className="!p-0 text-gray-600 hover:text-indigo-600" onClick={() => setView(VIEWS.EVENT_TYPES)}>
                <ChevronLeft className="w-5 h-5 mr-1" /> Back to Event Types
            </Button>
            <h1 className="text-3xl font-bold text-gray-800">{isEdit ? `Edit ${form.title}` : `Create New ${form.type}`}</h1>
            <p className="text-gray-500">Fill in the details to {isEdit ? 'update' : 'create'} your event.</p>

            <Card className="p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <InputField label="Event Title" name="title" value={form.title} onChange={handleChange} placeholder="My Event Name" required />
                    <InputField label="Event Type" name="type" value={form.type} disabled />

                    <div className="space-y-1">
                        <label className="text-sm font-medium text-gray-700 block">Description <span className="text-red-500">*</span></label>
                        <textarea
                            name="description"
                            value={form.description}
                            onChange={handleChange}
                            rows="4"
                            placeholder="Describe your event..."
                            required
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <InputField label="Start Time" name="startTime" type="datetime-local" value={form.startTime} onChange={handleChange} required icon={Clock} />
                        <InputField label="End Time" name="endTime" type="datetime-local" value={form.endTime} onChange={handleChange} required icon={Clock} />
                    </div>

                    <InputField label="Location" name="location" value={form.location} onChange={handleChange} placeholder="Chennai" required icon={MapPin} />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <InputField label="Budget ($)" name="budget" type="number" value={form.budget} onChange={handleChange} placeholder="0.00" icon={DollarSign} />
                        <InputField label="Number of Guests" name="guests" type="number" value={form.guests} onChange={handleChange} placeholder="0" icon={Users} />
                    </div>

                    <div className="pt-4 flex justify-end space-x-4">
                        <Button type="button" variant="secondary" onClick={() => setView(VIEWS.DASHBOARD)}>Cancel</Button>
                        <Button type="submit" variant="primary">{isEdit ? 'Update Event' : 'Create Event'}</Button>
                    </div>
                </form>
            </Card>
        </div>
    );
};

const VendorsView = ({ setView, events, setBookings }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('All');
    const [showBookModal, setShowBookModal] = useState(false);
    const [selectedVendor, setSelectedVendor] = useState(null);
    const [selectedEventId, setSelectedEventId] = useState('');

    const userEvents = events.filter(e => e.userId === CLIENT_DEMO_ID && e.status !== 'Completed');

    const filteredVendors = initialDemoVendors.filter(vendor => {
        const matchesSearch = vendor.businessName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            vendor.location.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType = filterType === 'All' || vendor.businessType === filterType;
        return matchesSearch && matchesType;
    });

    const handleBookClick = (vendor) => {
        setSelectedVendor(vendor);
        setSelectedEventId(userEvents.length > 0 ? userEvents[0].id.toString() : '');
        setShowBookModal(true);
    };

    const handleConfirmBook = async () => {
        if (!selectedVendor || !selectedEventId) return;

        const eventToBook = events.find(e => e.id === parseInt(selectedEventId));
        if (!eventToBook) return;

        const newBooking = {
            id: Date.now(),
            eventId: eventToBook.id,
            vendorId: selectedVendor.id,
            vendorName: selectedVendor.businessName,
            clientName: 'Ranjeetha M',
            clientEmail: 'ranjeethademo@gmail.com',
            clientPhone: '9428855637',
            eventTitle: eventToBook.title,
            date: eventToBook.startTime.split('T')[0],
            location: eventToBook.location,
            guests: eventToBook.guests,
            budget: eventToBook.budget,
            description: eventToBook.description,
            status: 'Pending'
        };

        try {
            await mockApiCall({ success: true, booking: newBooking }, true);
            initialDemoBookings.push(newBooking);
            setBookings(prev => [...prev, newBooking]);
            setShowBookModal(false);
            console.log('Booking request sent:', newBooking);
        } catch (error) {
            console.error('Failed to send booking request:', error);
        }
    };

    const BookingModal = () => (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <Card className="max-w-md w-full">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">Book {selectedVendor.businessName}</h2>
                    <Button variant="ghost" onClick={() => setShowBookModal(false)}><X className="w-5 h-5" /></Button>
                </div>
                <p className="text-gray-600 mb-4">Select which of your upcoming events you want to book this service for.</p>

                {userEvents.length === 0 ? (
                    <p className="text-red-500">You must create an event before booking a vendor.</p>
                ) : (
                    <SelectField
                        label="Select Event"
                        value={selectedEventId}
                        onChange={(e) => setSelectedEventId(e.target.value)}
                        options={userEvents.map(e => ({ value: e.id.toString(), label: `${e.title} (${e.date})` }))}
                        required
                    />
                )}

                <div className="mt-6 flex justify-end space-x-3">
                    <Button variant="secondary" onClick={() => setShowBookModal(false)}>Cancel</Button>
                    <Button
                        variant="primary"
                        onClick={handleConfirmBook}
                        disabled={!selectedEventId}
                    >
                        Send Booking Request
                    </Button>
                </div>
            </Card>
        </div>
    );

    return (
        <div className="p-6 space-y-6">
            <header className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-800">Find Event Vendors ({initialDemoVendors.length})</h1>
            </header>

            <Card className="p-4 flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 items-center">
                <div className="flex-1 w-full relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search vendors by name or location..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 pl-10"
                    />
                </div>
                <SelectField
                    label="Filter by Type"
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    options={['All', ...VENDOR_TYPES].map(type => ({ label: type, value: type }))}
                    name="filterType"
                    className="w-full md:w-auto"
                />
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
                {filteredVendors.length > 0 ? (
                    filteredVendors.map(vendor => (
                        <VendorCard key={vendor.id} vendor={vendor} onBook={handleBookClick} />
                    ))
                ) : (
                    <Card className="text-center py-12 text-gray-500 col-span-full">
                        <Filter className="w-8 h-8 mx-auto mb-3 text-red-400" />
                        <p className="font-semibold">No vendors match your criteria.</p>
                        <p className="text-sm">Try different filters or check back later!</p>
                    </Card>
                )}
            </div>

            {showBookModal && selectedVendor && <BookingModal />}
        </div>
    );
};

const MyBookingsView = ({ bookings }) => {
    const userBookings = bookings.filter(b => b.clientName === 'Ranjeetha M');
    const [filterStatus, setFilterStatus] = useState('All');

    const filteredBookings = userBookings.filter(b => filterStatus === 'All' || b.status === filterStatus);

    return (
        <div className="p-6 space-y-8">
            <header className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-800">My Booking Requests ({userBookings.length})</h1>
            </header>
            <p className="text-gray-500">Track the status of services you've requested from vendors.</p>

            <div className="flex space-x-4">
                {['All', 'Pending', 'Accepted', 'Rejected'].map(status => (
                    <Button
                        key={status}
                        variant={filterStatus === status ? 'primary' : 'secondary'}
                        size="sm"
                        onClick={() => setFilterStatus(status)}
                    >
                        {status} ({userBookings.filter(b => status === 'All' ? true : b.status === status).length})
                    </Button>
                ))}
            </div>

            <div className="space-y-4">
                {filteredBookings.length > 0 ? (
                    filteredBookings.map(booking => (
                        <BookingCard
                            key={booking.id}
                            booking={booking}
                            role={USER_ROLES.CLIENT}
                            onAction={() => {}}
                        />
                    ))
                ) : (
                    <Card className="text-center py-12 text-gray-500">
                        <Info className="w-8 h-8 mx-auto mb-3 text-gray-400" />
                        <p className="font-semibold">No bookings found</p>
                        <p className="text-sm">Request a service from the Vendors page!</p>
                    </Card>
                )}
            </div>
        </div>
    );
};

const CalendarView = ({ events, setView }) => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(new Date());

    const userEvents = events.filter(e => e.userId === CLIENT_DEMO_ID);

    const getDaysInMonth = (date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDayOfMonth = new Date(year, month, 1);
        const lastDayOfMonth = new Date(year, month + 1, 0);
        const startDayOfWeek = firstDayOfMonth.getDay(); 
        const days = [];

        const prevMonthLastDay = new Date(year, month, 0).getDate();
        for (let i = startDayOfWeek === 0 ? 6 : startDayOfWeek - 1; i > 0; i--) {
            days.push({ day: prevMonthLastDay - i + 1, isCurrentMonth: false, date: new Date(year, month - 1, prevMonthLastDay - i + 1) });
        }
        
        for (let i = 1; i <= lastDayOfMonth.getDate(); i++) {
            days.push({ day: i, isCurrentMonth: true, date: new Date(year, month, i) });
        }

        const totalDays = days.length;
        const remainingCells = 42 - totalDays; 
        for (let i = 1; i <= remainingCells; i++) {
            days.push({ day: i, isCurrentMonth: false, date: new Date(year, month + 1, i) });
        }

        return days;
    };

    const changeMonth = (delta) => {
        const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + delta, 1);
        setCurrentDate(newDate);
    };

    const eventsForDay = (date) => {
        const dateStr = date.toISOString().split('T')[0];
        return userEvents.filter(e => e.startTime.startsWith(dateStr));
    };

    const isSameDay = (date1, date2) => {
        return date1.getFullYear() === date2.getFullYear() &&
               date1.getMonth() === date2.getMonth() &&
               date1.getDate() === date2.getDate();
    };
    
    const isToday = (date) => isSameDay(date, new Date());
    const isSelected = (date) => isSameDay(date, selectedDate);

    const days = useMemo(() => getDaysInMonth(currentDate), [currentDate]);
    const selectedDayEvents = eventsForDay(selectedDate);
    
    const handleDayClick = (dateObj) => {
        setSelectedDate(dateObj.date);
    };
    
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    return (
        <div className="p-6 space-y-6 flex h-full">
            <Card className="flex-1 flex flex-col h-full overflow-hidden">
                <header className="flex justify-between items-center mb-6">
                    <Button variant="ghost" onClick={() => changeMonth(-1)}><ChevronLeft className="w-5 h-5" /></Button>
                    <h2 className="text-xl font-bold text-gray-800">{currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}</h2>
                    <Button variant="ghost" onClick={() => changeMonth(1)}><ChevronRight className="w-5 h-5" /></Button>
                </header>

                <div className="grid grid-cols-7 gap-2 flex-grow">
                    {dayNames.map(day => (
                        <div key={day} className="text-center font-semibold text-gray-500 text-sm">{day}</div>
                    ))}

                    {days.map((dayObj, index) => {
                        const eventCount = eventsForDay(dayObj.date).length;
                        const dayClassName = `p-2 text-center rounded-lg cursor-pointer transition duration-150 relative h-16 sm:h-20 flex flex-col justify-between items-center text-sm ${
                            !dayObj.isCurrentMonth ? 'text-gray-300' : 'text-gray-700'
                        } ${isToday(dayObj.date) ? 'border-2 border-indigo-500 font-bold' : ''} ${
                            isSelected(dayObj.date) && dayObj.isCurrentMonth ? 'bg-indigo-100 text-indigo-800 font-bold border-indigo-500' : (dayObj.isCurrentMonth ? 'hover:bg-gray-50' : '')
                        }`;
                        
                        return (
                            <div key={index} className={dayClassName} onClick={() => handleDayClick(dayObj)}>
                                <span className="absolute top-1 right-2 text-xs font-medium">{dayObj.day}</span>
                                {eventCount > 0 && (
                                    <span className={`w-2 h-2 rounded-full ${dayObj.isCurrentMonth ? 'bg-red-500' : 'bg-gray-400'} absolute bottom-2`}></span>
                                )}
                            </div>
                        );
                    })}
                </div>
            </Card>

            <Card className="w-full md:w-80 flex flex-col">
                <h3 className="text-xl font-bold mb-4">Events on {selectedDate.toLocaleDateString()}</h3>
                
                {selectedDayEvents.length > 0 ? (
                    <div className="space-y-4 overflow-y-auto">
                        {selectedDayEvents.map(event => (
                            <div key={event.id} className="p-3 border-l-4 border-indigo-500 bg-gray-50 rounded-r-lg">
                                <p className="font-semibold text-gray-800">{event.title}</p>
                                <p className="text-xs text-indigo-600">{event.type}</p>
                                <p className="text-xs text-gray-500">{new Date(event.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-8 text-gray-500">
                        <CalendarIcon className="w-8 h-8 mx-auto mb-3 text-gray-400" />
                        <p>No events scheduled for this date.</p>
                    </div>
                )}
                
                <div className="mt-auto pt-4 border-t">
                    <Button onClick={() => setView(VIEWS.EVENT_TYPES)} className="w-full flex items-center justify-center">
                        <Plus className="w-5 h-5 mr-1" /> Create Event
                    </Button>
                </div>
            </Card>
        </div>
    );
};

// =======================================================================================
// --- APP (Main Application Component - App.jsx) ----------------------------------------
// =======================================================================================

const App = () => {
    const [view, setView] = useState(VIEWS.LANDING);
    const [userId, setUserId] = useState(null);
    const [userRole, setUserRole] = useState(null);
    const [vendorProfile, setVendorProfile] = useState({});
    const [events, setEvents] = useState(initialDemoEvents);
    const [bookings, setBookings] = useState(initialDemoBookings);
    const [services, setServices] = useState(initialDemoServices); 

    const [selectedEventType, setSelectedEventType] = useState(null);
    const [selectedEventId, setSelectedEventId] = useState(null);
    const [isRedirectHandled, setIsRedirectHandled] = useState(false);

    useEffect(() => {
        if (userId && userRole && !isRedirectHandled) {
            if (userRole === USER_ROLES.VENDOR) {
                const isProfileComplete = initialDemoVendors.some(v => v.userId === userId && v.businessName);
                if (!isProfileComplete) {
                    setView(VIEWS.VENDOR_ONBOARDING);
                } else {
                    setView(VIEWS.DASHBOARD);
                }
            } else {
                setView(VIEWS.DASHBOARD);
            }
            setIsRedirectHandled(true);
        }
    }, [userId, userRole, vendorProfile.isComplete, isRedirectHandled]);


    const handleLogout = () => {
        setUserId(null);
        setUserRole(null);
        setVendorProfile({});
        setIsRedirectHandled(false);
        setView(VIEWS.LANDING);
    };

    const navLinks = useMemo(() => {
        if (!userRole) return [];

        if (userRole === USER_ROLES.CLIENT) {
            return [
                { name: 'Dashboard', icon: Home, view: VIEWS.DASHBOARD },
                { name: 'Events', icon: ListChecks, view: VIEWS.EVENTS_LIST },
                { name: 'Calendar', icon: CalendarIcon, view: VIEWS.CALENDAR },
                { name: 'Vendors', icon: Briefcase, view: VIEWS.VENDORS },
                { name: 'My Bookings', icon: Mail, view: VIEWS.MY_BOOKINGS },
            ];
        } else {
            return [
                { name: 'Dashboard', icon: Home, view: VIEWS.DASHBOARD },
                { name: 'Bookings', icon: Mail, view: VIEWS.VENDOR_BOOKINGS },
                { name: 'My Services', icon: Package, view: VIEWS.VENDOR_SERVICES },
                { name: 'Profile', icon: Settings, view: VIEWS.VENDOR_ONBOARDING },
            ];
        }
    }, [userRole]);

    const renderContent = () => {
        if (!userId || !userRole) {
            if (view === VIEWS.AUTH) {
                return <AuthView setView={setView} setUserRole={setUserRole} setUserId={setUserId} userRole={userRole} setVendorProfile={setVendorProfile} />;
            }
            return <LandingPageView setView={setView} setUserRole={setUserRole} setUserId={setUserId} />;
        }

        if (userRole === USER_ROLES.VENDOR && view === VIEWS.VENDOR_ONBOARDING) {
            return <VendorOnboardingView setView={setView} userId={userId} setVendorProfile={setVendorProfile} />;
        }

        switch (view) {
            case VIEWS.DASHBOARD:
                return userRole === USER_ROLES.CLIENT
                    ? <ClientDashboardView events={events} setView={setView} setSelectedEventId={setSelectedEventId} />
                    : <VendorDashboardView bookings={bookings} vendorProfile={{userId}} setBookings={setBookings} />;
            case VIEWS.EVENTS_LIST:
                return <EventsListView events={events} setView={setView} setSelectedEventId={setSelectedEventId} />;
            case VIEWS.CALENDAR:
                return <CalendarView events={events} setView={setView} />;
            case VIEWS.EVENT_TYPES:
                return <EventTypesView setView={setView} setSelectedEventType={setSelectedEventType} setSelectedEventId={setSelectedEventId} />;
            case VIEWS.CREATE_EVENT:
                return <CreateEventForm setView={setView} events={events} selectedEventId={selectedEventId} selectedEventType={selectedEventType} setEvents={setEvents} />;
            case VIEWS.VENDORS:
                return <VendorsView setView={setView} events={events} setBookings={setBookings} />;
            case VIEWS.MY_BOOKINGS:
                return <MyBookingsView bookings={bookings} />;
            case VIEWS.VENDOR_BOOKINGS:
                return <VendorBookingsView bookings={bookings} vendorProfile={{userId}} setBookings={setBookings} />;
            case VIEWS.VENDOR_SERVICES:
                return <VendorMyServicesView userId={userId} services={services} setServices={setServices} />;
            default:
                return <h1 className="p-8 text-3xl">404 View Not Found</h1>;
        }
    };

    const isMainAppLayout = userId !== null;
    const currentViewName = navLinks.find(l => l.view === view)?.name || (view === VIEWS.VENDOR_ONBOARDING ? 'Profile Setup' : APP_NAME);
    const currentUserProfile = userRole === USER_ROLES.CLIENT ? { name: 'Ranjeetha M' } : initialDemoVendors.find(v => v.userId === userId) || { businessName: 'Vendor' };


    if (!isMainAppLayout) {
        return renderContent();
    }

    return (
        <div className="flex h-screen bg-gray-50">
            {/* Sidebar (Fixed for desktop) */}
            <nav className="hidden md:flex flex-col w-64 bg-white shadow-xl">
                <div className="p-6 flex items-center border-b">
                    <Sparkles className="w-8 h-8 text-indigo-600 mr-2" />
                    <span className="text-xl font-bold text-gray-800">{APP_NAME}</span>
                </div>

                <div className="flex-1 p-4 space-y-1 overflow-y-auto">
                    {navLinks.map(link => (
                        <button
                            key={link.name}
                            onClick={() => setView(link.view)}
                            className={`flex items-center w-full py-3 px-4 rounded-lg transition duration-150 text-left ${view === link.view
                                ? 'bg-indigo-500 text-white font-semibold shadow-md'
                                : 'text-gray-600 hover:bg-gray-100 hover:text-indigo-600'
                                }`}
                        >
                            <link.icon className="w-5 h-5 mr-3" />
                            {link.name}
                        </button>
                    ))}
                </div>

                <div className="p-4 border-t">
                    <div className="flex items-center mb-3">
                        <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold mr-3">
                            {userRole === USER_ROLES.CLIENT ? 'R' : (currentUserProfile.businessName ? currentUserProfile.businessName[0] : 'V')}
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-gray-800">{userRole === USER_ROLES.CLIENT ? 'Ranjeetha M' : currentUserProfile.businessName || 'Vendor User'}</p>
                            <p className="text-xs text-gray-500 capitalize">{userRole}</p>
                        </div>
                    </div>
                    <Button variant="danger" size="sm" onClick={handleLogout} className="w-full flex items-center justify-center">
                        <LogOut className="w-4 h-4 mr-2" /> Logout
                    </Button>
                </div>
            </nav>

            {/* Main Content Area */}
            <main className="flex-1 overflow-y-auto">
                {/* Header (Top Nav) */}
                <header className="sticky top-0 bg-white shadow-sm p-4 border-b z-10 flex justify-between items-center">
                    <h1 className="text-xl font-semibold text-gray-800">{currentViewName}</h1>
                    <div className="flex items-center space-x-3">
                        {/* Mobile Menu Button */}
                        <div className="md:hidden">
                            <Button variant="secondary" size="sm" onClick={() => console.log('Toggle Menu')}>Menu</Button>
                        </div>

                        {/* Logout for mobile/tablet */}
                        <Button variant="secondary" size="sm" onClick={handleLogout} className="md:hidden">
                            <LogOut className="w-4 h-4" />
                        </Button>

                        <span className="hidden sm:inline text-gray-600">Hi, Ranjeetha!</span>
                        <Button variant="danger" size="sm" onClick={handleLogout} className="hidden md:inline-flex">
                            Logout
                        </Button>
                    </div>
                </header>

                {/* Content Area */}
                <div className="p-0 pb-16">
                    {renderContent()}
                </div>
            </main>
        </div>
    );
};

export default App;

