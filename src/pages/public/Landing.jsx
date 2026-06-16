import React, { useContext, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { DataContext } from '../../contexts/DataContext';
import { useAuth } from '../../hooks/useAuth';
import { getVehicleImage, getHeroBgImage } from '../../utils/imageHelper';
import { formatCurrency } from '../../utils/formatters';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { motion } from 'framer-motion';
import {
  FiPhone,
  FiMapPin,
  FiChevronRight,
  FiInfo,
  FiShield,
  FiCheck,
  FiCalendar,
  FiClock,
  FiUsers
} from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';

export const Landing = () => {
  const { vehicles, settings } = useContext(DataContext);
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Scroll to section from navigation redirect
  useEffect(() => {
    if (location.state && location.state.scrollTo) {
      const element = document.getElementById(location.state.scrollTo);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
        // Clear state
        window.history.replaceState({}, document.title);
      }
    }
  }, [location]);

  // Featured 6 vehicles as specified in Section 6.2
  const featuredNames = [
    'Thar Roxx',
    'Swift',
    'Ertiga Petrol',
    'Innova Crysta',
    'Hyundai Venue',
    'Kia Carens Gravity'
  ];

  const featuredVehicles = vehicles.filter(v =>
    featuredNames.some(name => v.name.toLowerCase() === name.toLowerCase())
  );

  const handleBookingClick = () => {
    if (currentUser) {
      navigate('/user/cars');
    } else {
      navigate('/login');
    }
  };

  const handleScrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const whatsappNumber = settings?.whatsapp || '918111004777';
  const whatsappMsg = encodeURIComponent("Hello AL-MAS Cars, I would like to enquire about vehicle availability.");
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${whatsappMsg}`;

  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  return (
    <div className="flex flex-col w-full overflow-hidden bg-charcoal-base">
      
      {/* Hero Section */}
      <section
        id="hero"
        className="relative min-h-[90vh] flex items-center justify-center bg-cover bg-center py-20 px-4 md:px-8 border-b border-white/10"
        style={{
          backgroundImage: `linear-gradient(to bottom, rgba(10, 10, 10, 0.7), rgba(10, 10, 10, 0.95)), url(${getHeroBgImage()})`
        }}
      >
        <div className="max-w-4xl mx-auto text-center flex flex-col items-center gap-6 z-10">
          <motion.span
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="text-gold border border-gold/30 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-[0.2em] bg-gold/5"
          >
            Premium Self Drive Rental
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-heading text-4xl sm:text-6xl font-bold leading-tight text-white"
          >
            Drive Your <span className="gold-gradient-text text-glow">Dream Car</span> Today
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-gray-400 text-base sm:text-lg max-w-2xl leading-relaxed font-sans"
          >
            Explore Chennai with absolute freedom. AL-MAS Self Drive Cars offers premium, sanitised, and well-maintained self-drive vehicles. No driver, no hassle.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex items-center gap-4 flex-wrap justify-center mt-4"
          >
            <Button variant="primary" onClick={() => handleScrollTo('preview-cars')}>
              <span>View Cars</span>
              <FiChevronRight />
            </Button>
            {currentUser ? (
              <Link to="/user/dashboard" className="gold-btn-secondary">
                Go to Dashboard
              </Link>
            ) : (
              <div className="flex gap-3">
                <Link to="/login" className="gold-btn-secondary">
                  Login
                </Link>
                <Link to="/signup" className="text-gray-300 hover:text-white px-4 py-2 text-sm font-semibold transition-colors duration-150">
                  Register
                </Link>
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-24 px-4 md:px-8 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
            className="lg:col-span-5 flex flex-col gap-6"
          >
            <span className="text-gold font-semibold text-sm uppercase tracking-widest">About Our Brand</span>
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-white">
              AL-MAS Self Drive Cars
            </h2>
            <p className="text-gray-400 leading-relaxed text-sm">
              We are Chennai's premium self-drive rental service, located near Mannady Metro Station. Our core mission is to provide an elite, affordable, and flexible driving experience. Whether you need an SUV for a family trip, a sleek sedan for corporate travel, or a hatchback for quick errands, we've got you covered.
            </p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center shrink-0 border border-gold/20">
                <FiMapPin className="text-gold w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium">Headquarters</p>
                <p className="text-sm font-semibold text-white">{settings?.location || "Chennai Mannady Metro Station"}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6"
          >
            <Card hoverEffect={true} className="p-6">
              <FiClock className="w-8 h-8 text-gold mb-4" />
              <h3 className="text-lg font-semibold text-white font-heading mb-2">24/7 Road Assistance</h3>
              <p className="text-xs text-gray-500 leading-relaxed">Our support desk is always active to ensure your journey is smooth and worry-free.</p>
            </Card>
            <Card hoverEffect={true} className="p-6">
              <FiShield className="w-8 h-8 text-gold mb-4" />
              <h3 className="text-lg font-semibold text-white font-heading mb-2">Well Maintained Vehicles</h3>
              <p className="text-xs text-gray-500 leading-relaxed">Each vehicle undergoes detailed servicing and checks prior to trip handover.</p>
            </Card>
            <Card hoverEffect={true} className="p-6">
              <FiUsers className="w-8 h-8 text-gold mb-4" />
              <h3 className="text-lg font-semibold text-white font-heading mb-2">Door Step Delivery</h3>
              <p className="text-xs text-gray-500 leading-relaxed">Select doorstep drop and pickup during booking for maximum flexibility.</p>
            </Card>
            <Card hoverEffect={true} className="p-6">
              <FiInfo className="w-8 h-8 text-gold mb-4" />
              <h3 className="text-lg font-semibold text-white font-heading mb-2">Affordable Pricing</h3>
              <p className="text-xs text-gray-500 leading-relaxed">Flexible 12 Hr and 24 Hr pricing plans designed to fit your budget requirements.</p>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section id="why-us" className="py-24 px-4 md:px-8 border-t border-white/10 bg-charcoal-elevated/40">
        <div className="max-w-7xl mx-auto w-full flex flex-col gap-16">
          <div className="text-center max-w-xl mx-auto flex flex-col gap-4">
            <span className="text-gold font-semibold text-sm uppercase tracking-widest">Why Choose Us</span>
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-white">The Luxury Self Drive Standard</h2>
            <p className="text-gray-500 text-sm">We provide high-quality rentals with clear rules and absolute transparency.</p>
          </div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6"
          >
            <Card hoverEffect={true} className="p-6 flex flex-col gap-3">
              <div className="w-8 h-8 rounded-lg bg-gold/10 text-gold flex items-center justify-center"><FiCheck /></div>
              <h4 className="font-heading text-base font-semibold text-white">Refundable Deposit</h4>
              <p className="text-xs text-gray-500 leading-relaxed">Prompt ₹5000 security deposit return upon vehicle checkout inspection.</p>
            </Card>
            <Card hoverEffect={true} className="p-6 flex flex-col gap-3">
              <div className="w-8 h-8 rounded-lg bg-gold/10 text-gold flex items-center justify-center"><FiCheck /></div>
              <h4 className="font-heading text-base font-semibold text-white">Verified Vehicles</h4>
              <p className="text-xs text-gray-500 leading-relaxed">Completely verified cars with current registrations and documentation.</p>
            </Card>
            <Card hoverEffect={true} className="p-6 flex flex-col gap-3">
              <div className="w-8 h-8 rounded-lg bg-gold/10 text-gold flex items-center justify-center"><FiCheck /></div>
              <h4 className="font-heading text-base font-semibold text-white">Flexible Plans</h4>
              <p className="text-xs text-gray-500 leading-relaxed">Adjust your rental period from hours to days seamlessly.</p>
            </Card>
            <Card hoverEffect={true} className="p-6 flex flex-col gap-3">
              <div className="w-8 h-8 rounded-lg bg-gold/10 text-gold flex items-center justify-center"><FiCheck /></div>
              <h4 className="font-heading text-base font-semibold text-white">WhatsApp Support</h4>
              <p className="text-xs text-gray-500 leading-relaxed">Immediate verification updates and help desks on WhatsApp.</p>
            </Card>
            <Card hoverEffect={true} className="p-6 flex flex-col gap-3">
              <div className="w-8 h-8 rounded-lg bg-gold/10 text-gold flex items-center justify-center"><FiCheck /></div>
              <h4 className="font-heading text-base font-semibold text-white">Easy Booking</h4>
              <p className="text-xs text-gray-500 leading-relaxed">Choose dates, select models, and submit booking requests in seconds.</p>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Available Vehicles Preview Grid */}
      <section id="preview-cars" className="py-24 px-4 md:px-8 max-w-7xl mx-auto w-full">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div className="flex flex-col gap-4">
            <span className="text-gold font-semibold text-sm uppercase tracking-widest text-left">Our Premium Fleet</span>
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-white text-left">Explore Popular Models</h2>
          </div>
          <Link
            to={currentUser ? "/user/cars" : "/login"}
            className="gold-btn-secondary text-xs uppercase tracking-wider font-bold shrink-0 self-start md:self-auto"
          >
            View Full Fleet (21 Cars)
          </Link>
        </div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {featuredVehicles.map((car) => {
            const imgUrl = getVehicleImage(car.slug);
            return (
              <motion.div key={car.id} variants={fadeInUp} className="h-full">
                <Card hoverEffect={true} className="p-5 flex flex-col justify-between h-full border border-white/5 bg-white/5 relative overflow-hidden group">
                  <div>
                    {/* Image Placeholder Fallback */}
                    <div className="w-full h-48 rounded-xl overflow-hidden mb-5 bg-charcoal-base relative flex items-center justify-center border border-white/10">
                      {imgUrl ? (
                        <img
                          src={imgUrl}
                          alt={car.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-charcoal-elevated to-charcoal-base w-full h-full text-gold">
                          <FiShield className="w-10 h-10 opacity-40" />
                          <span className="text-xs uppercase tracking-widest opacity-60 font-semibold">{car.name}</span>
                        </div>
                      )}
                      <span className="absolute top-3 right-3 text-[10px] uppercase font-bold px-2.5 py-1 rounded bg-black/80 text-gold border border-gold/30">
                        {car.category}
                      </span>
                    </div>

                    <h3 className="font-heading text-xl font-bold text-white text-left mb-3">{car.name}</h3>

                    {/* Specs Chips */}
                    <div className="flex items-center gap-3 text-xs text-gray-500 mb-6 flex-wrap">
                      <span className="bg-white/5 px-2.5 py-1 rounded-md border border-white/5">{car.transmission}</span>
                      <span className="bg-white/5 px-2.5 py-1 rounded-md border border-white/5">{car.fuel}</span>
                      <span className="bg-white/5 px-2.5 py-1 rounded-md border border-white/5">{car.seats} Seats</span>
                    </div>
                  </div>

                  {/* Pricing / CTA */}
                  <div>
                    <div className="border-t border-white/5 pt-4 mb-5 flex justify-between items-center text-sm">
                      <div className="text-left">
                        <p className="text-[10px] uppercase text-gray-600 font-semibold">12 Hours</p>
                        <p className="text-lg font-bold text-white font-heading mt-0.5">{formatCurrency(car.price12)}</p>
                      </div>
                      <div className="w-px h-8 bg-white/10" />
                      <div className="text-left">
                        <p className="text-[10px] uppercase text-gray-600 font-semibold">24 Hours</p>
                        <p className="text-lg font-bold text-gold font-heading mt-0.5">{formatCurrency(car.price24)}</p>
                      </div>
                      <div className="w-px h-8 bg-white/10" />
                      <div className="text-left">
                        <p className="text-[10px] uppercase text-gray-600 font-semibold">Extra KM</p>
                        <p className="text-sm font-semibold text-gray-400 mt-1">{formatCurrency(car.extraKm)}/KM</p>
                      </div>
                    </div>

                    <button
                      onClick={handleBookingClick}
                      className="w-full text-xs font-bold uppercase tracking-wider py-3 rounded-xl bg-gold text-black hover:bg-gold-light transition-all flex items-center justify-center gap-2"
                    >
                      <span>Book Drive Now</span>
                      <FiChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24 px-4 md:px-8 border-t border-white/10 bg-charcoal-elevated/20">
        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="lg:col-span-6 flex flex-col gap-6 text-left"
          >
            <span className="text-gold font-semibold text-sm uppercase tracking-widest">Contact Information</span>
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-white">Get in Touch with AL-MAS</h2>
            <p className="text-gray-400 leading-relaxed text-sm">
              Do you have questions about deposits, documentation, or booking slots? Send us a message directly on WhatsApp or phone our help desk at any time. We are always ready to assist you.
            </p>

            <div className="flex flex-col gap-4 mt-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 text-gold flex items-center justify-center shrink-0">
                  <FiPhone />
                </div>
                <div>
                  <p className="text-[10px] text-gray-600 font-bold uppercase">Phone Number</p>
                  <a href={`tel:${settings?.phone || "8111004777"}`} className="text-sm font-semibold text-white hover:text-gold transition-colors">
                    {settings?.phone || "8111004777"}
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 text-gold flex items-center justify-center shrink-0">
                  <FiMapPin />
                </div>
                <div>
                  <p className="text-[10px] text-gray-600 font-bold uppercase">Location Office</p>
                  <span className="text-sm font-semibold text-white">
                    {settings?.location || "Chennai Mannady Metro Station (Near Parrys)"}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex gap-4 flex-wrap pt-2">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="gold-btn-primary flex items-center gap-2 text-xs font-bold uppercase"
              >
                <FaWhatsapp className="w-4 h-4 text-black shrink-0" />
                <span>Enquire on WhatsApp</span>
              </a>
              <Link to="/deposit-details" className="gold-btn-secondary text-xs uppercase font-bold tracking-wider">
                Deposit Details
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="lg:col-span-6"
          >
            {/* Embedded Google Map Placeholder */}
            <div className="w-full h-80 rounded-2xl overflow-hidden border border-white/10 shadow-gold-glow relative bg-charcoal-elevated">
              <div className="absolute inset-0 flex flex-col items-center justify-center p-6 bg-gradient-to-br from-charcoal-elevated to-charcoal-base text-gray-400 gap-3">
                <FiMapPin className="w-12 h-12 text-gold opacity-60 animate-bounce" />
                <h3 className="font-heading text-lg font-bold text-white">Mannady Metro Station</h3>
                <p className="text-xs text-center max-w-sm">Near Parrys, Chennai, Tamil Nadu, India.</p>
                <span className="text-[10px] text-gray-600 font-mono">13.1044° N, 80.2882° E</span>
              </div>
            </div>
          </motion.div>

        </div>
      </section>

    </div>
  );
};
export default Landing;
