import { useEffect, useRef, useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Link } from "react-router-dom";
import { Flame, User, LogOut, Settings, LocateIcon, Menu, LogOutIcon, MapPin } from "lucide-react";
import { useUserStore } from "../store/useUserStore";
import LocationComponent from "../pages/Location";

export const Header = () => {
  const { authUser, logout } = useAuthStore();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [settingsDropdownOpen, setSettingsDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [genderPreference, setGenderPreference] = useState(authUser.genderPreference || []);
  const [selectedLocations, setSelectedLocations] = useState(authUser.preferredLocation || []); 
  const dropdownRef = useRef(null);
  const settingsDropdownRef = useRef(null);
  const { loading, updateProfile } = useUserStore();

  const handleSubmit = (e) => {
    e.preventDefault();
    updateProfile({ genderPreference, preferredLocation: selectedLocations });
  };

  const clearFilters = () => {
    setGenderPreference(authUser.genderPreference || []);
    setSelectedLocations(authUser.preferredLocation || []);
  };

  const handleLocationChange = (preferredLocation) => {
    setSelectedLocations((prevLocations) =>
      prevLocations.includes(preferredLocation)
        ? prevLocations.filter((loc) => loc !== preferredLocation)
        : [...prevLocations, preferredLocation]
    );
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
      if (settingsDropdownRef.current && !settingsDropdownRef.current.contains(event.target)) {
        setSettingsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className='bg-gradient-to-r from-pink-500 via-pink-600 to-pink-700 shadow-lg'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex justify-between items-center py-4'>
          <div className='flex items-center'>
            <Link to='/' className='flex items-center space-x-2'>
              <Flame className='w-8 h-8 text-white' />
              <span className='text-2xl font-bold text-white hidden sm:inline'>Swipe</span>
            </Link>
          </div>

          <div className='flex items-center space-x-4'>
            {authUser ? (
              <>
                <div className='relative' ref={settingsDropdownRef}>
                  <button onClick={() => setSettingsDropdownOpen(!settingsDropdownOpen)}>
                    <Settings size={24} className='text-white hover:text-pink-200 transition duration-150 ease-in-out' />
                  </button>
                  {settingsDropdownOpen && (
                    <div className='absolute  right-[calc(50%-125px)] mt-2 w-[250px] bg-white rounded-md shadow-lg py-1 z-10'>
                      <div className='px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center'>
                        
                       
                        <LocationComponent/>
                      </div>
                      <div className='px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center'>  <MapPin className='mr-2' size={16} />Preferred match Location </div>
                      <div className='flex flex-col px-6 h-[300px] md:h-[200px] lg:h-[200px] overflow-y-auto'>
                              {[
                                "Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa", "Benue", "Borno",
                                "Cross River", "Delta", "Ebonyi", "Edo", "Ekiti", "Enugu", "Gombe", "Imo", "Jigawa",
                                "Kaduna", "Kano", "Katsina", "Kebbi", "Kogi", "Kwara", "Lagos", "Nasarawa", "Niger",
                                "Ogun", "Ondo", "Osun", "Oyo", "Plateau", "Rivers", "Sokoto", "Taraba", "Yobe",
                                "Zamfara", "Abuja", "whole country"
                              ]
                                .sort((a, b) => {
                                  const aSelected = selectedLocations.includes(a);
                                  const bSelected = selectedLocations.includes(b);
                                  if (aSelected && !bSelected) return -1;
                                  if (!aSelected && bSelected) return 1;
                                  return 0;
                                })
                                .map((location) => (
                                  <label key={location} className='inline-flex items-center'>
                                    <input
                                      type='checkbox'
                                      className='form-checkbox text-pink-600'
                                      checked={selectedLocations.includes(location)}
                                      onChange={() => handleLocationChange(location)}
                                    />
                                    &nbsp; {location}
                                  </label>
                                ))}
                            </div>


                      <div className='px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center'>
                        <User className='mr-2' size={16} />
                        Age
                      </div>
                      <div className='px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center'>
                        <User className='mr-2' size={16} />
                        Gender Preference
                      </div>
                      {/* GENDER PREFERENCE */}
                            <div className='flex flex-col px-6'>
                        {["Male", "Female", "Both"].map((option) => (
                          <label key={option} className='inline-flex items-center'>
                            <input
                              type='checkbox'
                              className='form-checkbox ml-2 text-pink-600'
                              checked={genderPreference.toLowerCase() === option.toLowerCase()}
                              onChange={() => setGenderPreference(option.toLowerCase())}
                            />
                            <span className='ml-2'>{option}</span>
                          </label>
                        ))}
                      </div>
                   
                      
                      <div className="flex space-x-4 items-center justify-center">
                      <button
                        type='submit'
                        className='w-[40%] flex mt-2 justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-pink-600 hover:bg-pink-700 
                        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500'
                        disabled={loading}
                        onClick={handleSubmit}
                      >
                        {loading ? "Applying..." : "Apply"}
                      </button>
                      <button
                        type='submit'
                        className='w-[40%] flex justify-center mt-2 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-pink-600 hover:bg-pink-700 
                        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500'
                        disabled={loading}
                        onClick={clearFilters}
                      >
                        clear filter
                      </button>
                      </div>
                    </div>
                  )}
                </div>
                <div className='relative hidden md:flex' ref={dropdownRef}>
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className='flex items-center space-x-2 focus:outline-none'
                  >
                    <img
                      src={authUser.image || "/avatar.png"}
                      className='h-10 w-10 object-cover rounded-full border-2 border-white'
                      alt='User image'
                    />
                    <span className='hidden sm:inline text-white font-medium'>{authUser.name}</span>
                  </button>
                  {dropdownOpen && (
                    <div className='absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10'>
                      <Link
                        to='/profile'
                        className='px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center'
                        onClick={() => setDropdownOpen(false)}
                      >
                        <User className='mr-2' size={16} />
                        Profile
                      </Link>
                      <button
                        onClick={logout}
                        className='w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center'
                      >
                        <LogOut className='mr-2' size={16} />
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link
                  to='/auth'
                  className='text-white hover:text-pink-200 transition duration-150 ease-in-out'
                >
                  Login
                </Link>
                <Link
                  to='/auth'
                  className='bg-white text-pink-600 px-4 py-2 rounded-full font-medium hover:bg-pink-100 transition duration-150 ease-in-out'
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
          <div className='md:hidden'>
						<button
							onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
							className='text-white focus:otline-none'
						>
							<Menu className='size-6' />
						</button>
					</div>
        </div>
      </div>

      

       {/* MOBILE MENU */}

        {mobileMenuOpen && (
         <div className='md:hidden bg-pink-600'>
           <div className='px-2 pt-2 pb-3 space-y-1 sm:px-3'>
             {authUser ? (
               <>
                 <Link
                   to='/profile'
                   className='px-3 py-2 rounded-md text-base font-medium text-white hover:bg-pink-700 flex items-center space-x-2 gap-2 focus:outline-none'
                   onClick={() => setMobileMenuOpen(false)}
                 >
                  <img
                      src={authUser.image || "/avatar.png"}
                      className='h-10 w-10 object-cover rounded-full border-2 border-white'
                      alt='User image'
                    />
                   Profile
                 </Link>
                 <button
                   onClick={() => {
                     logout();
                     setMobileMenuOpen(false);
                   }}
                   className='flex items-center space-x-2 focus:outline-none w-full text-left px-3 py-2 rounded-md text-base font-medium text-white hover:bg-pink-700'
                 >
                  <LogOutIcon className="h-10 w-10 mr-2"/>
                   Logout
                 </button>
               </>
             ) : (
               <>
                 <Link
                   to='/auth'
                   className='block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-pink-700'
                   onClick={() => setMobileMenuOpen(false)}
                 >
                   Login
                 </Link>
                 <Link
                   to='/auth'
                   className='block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-pink-700'
                   onClick={() => setMobileMenuOpen(false)}
                 >
                   Sign Up
                 </Link>
               </>
             )}
           </div>
         </div>
       )} 
    </header>
  );
};
