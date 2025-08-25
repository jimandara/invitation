// Filename: src/pages/Homepage.jsx

import { useState, useEffect, type JSX } from "react";
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from "framer-motion";
import pictureUrl from "/arajimPIC.jpg";
import pictureBG from "/bgpic2.jpg";
import axios from 'axios'; // <-- GIDUGANG ANG AXIOS IMPORT

// Shadcn UI and Lucide React Imports
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { 
  ChevronDown, Menu, Gift, Camera, Home, BookHeart, ClipboardList, 
  Heart, HelpCircle, PartyPopper, Users, Send, BellRing,
  X, ArrowLeft, ArrowRight, ChevronUp
} from "lucide-react";

// NAVLINKS (No Change)
const navLinks = [
  { href: "#home", label: "Home", icon: <Home className="h-6 w-6" /> },
  { href: "#story", label: "Our Story", icon: <BookHeart className="h-6 w-6" /> },
  { href: "#details", label: "Details", icon: <ClipboardList className="h-6 w-6" /> },
  { href: "#gallery", label: "Gallery", icon: <Camera className="h-6 w-6" /> },
  { href: "#faqs", label: "FAQs", icon: <HelpCircle className="h-6 w-6" /> },
  { href: "#registry", label: "Registry", icon: <Gift className="h-6 w-6" /> },
];

// FAQS DATA (No Change)
const faqData = [
  { question: "When is the RSVP deadline?", answer: "Please RSVP by January 10, 2026, so we can get an accurate headcount for our vendors. You can RSVP through the form on this website." },
  { question: "Can I bring a a plus-one?", answer: "Due to venue capacity, we can only accommodate guests named on the invitation. Thank you for your understanding!" },
  { question: "Are children welcome?", answer: "While we love your little ones, our wedding will be an adults-only occasion. We hope you can enjoy a relaxing night out with us!" },
  { question: "What is the dress code?", answer: "The dress code is Formal Attire. We suggest suits for men and floor-length gowns or elegant cocktail dresses for women. Suggested colors are soft pastels and neutrals." },
  { question: "Is there parking available at the venues?", answer: "Yes, both Manila Cathedral and The Blue Leaf Filipinas have ample parking space available for guests." },
];

// Reusable animation variants for consistency
const fadeIn = {
  initial: { opacity: 0, y: 40 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.8 } }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.2
    }
  }
};

// DATA PARA SA GALLERY (No Change)
const galleryImages = [
  { src: "gallery/gallery1.jpg", alt: "Gallery Image 1", layout: "col-span-1 row-span-1" },
  { src: "gallery/gallery2.jpg", alt: "Gallery Image 2", layout: "col-span-1 row-span-2" },
  { src: "gallery/gallery3.jpg", alt: "Gallery Image 3", layout: "col-span-1 row-span-1" },
  { src: "gallery/gallery4.jpg", alt: "Gallery Image 4", layout: "col-span-2 row-span-2" },
  { src: "gallery/gallery5.jpg", alt: "Gallery Image 5", layout: "col-span-1 row-span-1" },
  { src: "gallery/gallery6.jpg", alt: "Gallery Image 6", layout: "col-span-1 row-span-2" },
  { src: "gallery/gallery7.jpg", alt: "Gallery Image 7", layout: "col-span-1 row-span-1" },
  { src: "gallery/gallery8.jpg", alt: "Gallery Image 8", layout: "col-span-1 row-span-1" },
];


// Countdown Timer Component (No Changes)
interface TimeLeft { days?: number; hours?: number; minutes?: number; seconds?: number; }
interface CountdownProps { targetDate: string; }
const CountdownTimer = ({ targetDate }: CountdownProps) => {
  const calculateTimeLeft = (): TimeLeft => {
    const difference = +new Date(targetDate) - +new Date();
    let timeLeft: TimeLeft = {};
    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }
    return timeLeft;
  };
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft());
  useEffect(() => {
    const timer = setTimeout(() => setTimeLeft(calculateTimeLeft()), 1000);
    return () => clearTimeout(timer);
  });
  const timerComponents: JSX.Element[] = [];
  Object.keys(timeLeft).forEach((interval) => {
    const key = interval as keyof TimeLeft;
    const value = timeLeft[key];
    if (value !== undefined) {
      timerComponents.push(
        <div key={key} className="flex flex-col items-center">
          <span className=" text-4xl md:text-5xl font-light tracking-tighter text-white">{value}</span>
          <span className="text-xs uppercase text-white/70 tracking-wider">{key}</span>
        </div>
      );
    }
  });
  return (
    <div className="flex justify-center gap-6 md:gap-10 mt-8">
      {timerComponents.length ? timerComponents : <span className="text-xl text-white ">The day is here!</span>}
    </div>
  );
};


function Homepage() {
  const [_loading, setLoading] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // FUNCTIONS PARA SA LIGHTBOX NAVIGATION (No Change)
  const handleNextImage = () => {
    if (selectedImage) {
      const currentIndex = galleryImages.findIndex(img => img.src === selectedImage);
      const nextIndex = (currentIndex + 1) % galleryImages.length;
      setSelectedImage(galleryImages[nextIndex].src);
    }
  };

  const handlePrevImage = () => {
    if (selectedImage) {
      const currentIndex = galleryImages.findIndex(img => img.src === selectedImage);
      const prevIndex = (currentIndex - 1 + galleryImages.length) % galleryImages.length;
      setSelectedImage(galleryImages[prevIndex].src);
    }
  };

  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 50);
  });

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  const brideName = "Jim";
  const groomName = "Arabelle";
  const weddingDate = "Saturday, February 14, 2026";
  const weddingDateTime = "2026-02-14T16:00:00";
  const weddingTime = "Four o'clock in the afternoon";
  const ceremonyVenue = "JAMC Tagoloan";
  const receptionVenue = "The Blue Leaf Filipinas";
  const receptionAddress = "Parañaque City";

  const [formData, setFormData] = useState({
    FullName: "",
    Email: "",
    Message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState("");

  // Gi-improve ang type para sa event (e)
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // --- GI-UPDATE ANG SUBMIT HANDLER PARA MOGAMIT OG AXIOS ---
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus("");

    const scriptURL = 'https://script.google.com/macros/s/AKfycbzp5Ux7CKPj6U3DNAAfCDBagaU9c4B7ESMqGs9dXtj_QBWd53H363gFc_qYt-gDOUn0BQ/exec'; 
    
    const formBody = new FormData();
    formBody.append('FullName', formData.FullName);
    formBody.append('Email', formData.Email);
    formBody.append('Message', formData.Message);

    axios.post(scriptURL, formBody)
      .then(response => {
        console.log('Success!', response);
        setSubmitStatus("Thank you! Your RSVP has been submitted. 💖");
        setFormData({ FullName: "", Email: "", Message: "" }); // Clear the form
      })
      .catch(error => {
        console.error('Error!', error);
        setSubmitStatus("Oops! Something went wrong. Please try again.");
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  return (
    <div className="bg-background text-foreground">
      <div className="fixed inset-0 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center animate-kenburns scale-105"
          style={{ backgroundImage: `url(${pictureBG})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/50 to-black/80" />
      </div>

      <header className={`fixed top-0 left-0 z-50 w-full transition-all duration-300 ${scrolled ? 'bg-black/20 backdrop-blur-lg border-b border-white/10 shadow-lg' : 'bg-transparent'}`}>
        <nav className="container mx-auto flex items-center justify-between px-6 py-4">
          <a href="#home" className="text-3xl  text-white tracking-wider [text-shadow:1px_1px_8px_rgba(0,0,0,0.9)]">
            J & A
          </a>
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a key={link.label} href={link.href} className="text-white text-lg transition-all duration-300 hover:text-rose-300 hover:drop-shadow-[0_0_10px_rgba(255,182,193,0.7)]">
                {link.label}
              </a>
            ))}
          </div>
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="text-white hover:bg-white/20 rounded-full">
                  <Menu className="h-7 w-7" />
                  <span className="sr-only">Toggle Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="bg-stone-900/80 backdrop-blur-2xl border-l-border w-[300px] p-0">
                <div className="p-6 border-b border-white/20 text-center">
                  <h2 className="text-3xl  text-rose-300">J & A</h2>
                </div>
                <div className="flex flex-col p-4 mt-4">
                  {navLinks.map((link, index) => (
                    <SheetClose asChild key={link.label}>
                      <motion.a
                        href={link.href}
                        className="flex items-center gap-4 w-full p-4 my-1 text-xl text-white rounded-lg transition-all duration-300 hover:bg-rose-300/20 focus:bg-rose-300/20"
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                      >
                        {link.icon}
                        <span>{link.label}</span>
                      </motion.a>
                    </SheetClose>
                  ))}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </nav>
      </header>

      <div className="relative z-10">
        <section id="home" className="relative flex flex-col items-center justify-center min-h-screen p-4 sm:p-6 py-32">
          <motion.div
            initial={{ opacity: 0, y: 50, rotate: -2 }}
            animate={{ opacity: 1, y: 0, rotate: 0 }}
            transition={{ duration: 1.2 }}
          >
            <Card className="w-full max-w-xl bg-black/10 backdrop-blur-sm border border-white/20 text-center shadow-2xl rounded-3xl overflow-hidden">
              <CardHeader className="px-8 pt-12 pb-8">
                <motion.p variants={fadeIn} className="text-md text-white/80 tracking-widest uppercase mb-6 font-light">
                  Save the Date
                </motion.p>
                <motion.div variants={staggerContainer} initial="initial" animate="animate">
                  <motion.div variants={fadeIn}>
                    <CardTitle className=" text-6xl md:text-8xl text-white leading-tight [text-shadow:2px_2px_12px_rgba(0,0,0,0.7)]">
                      {brideName}
                      <span className="block text-4xl font-light text-transparent bg-clip-text bg-gradient-to-r from-pink-300 via-rose-400 to-red-400 my-4">
                        &
                      </span>
                      {groomName}
                    </CardTitle>
                  </motion.div>
                  <motion.div variants={fadeIn}>
                    <CardDescription className="pt-6 text-lg text-white/90 max-w-md mx-auto">
                      Are getting married and joyfully invite you to their celebration
                    </CardDescription>
                  </motion.div>
                </motion.div>
              </CardHeader>
              <CardContent className="px-8 pb-12">
                <Separator className="my-8 bg-white/25" />
                <CountdownTimer targetDate={weddingDateTime} />
              </CardContent>
            </Card>
          </motion.div>
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2">
            <a href="#story" aria-label="Scroll to next section">
              <ChevronDown className="h-10 w-10 text-white/80 animate-bounce" />
            </a>
          </div>
        </section>

        <section id="story" className="min-h-screen p-4 sm:p-8 py-32 relative">
          <div className="container mx-auto">
            <motion.div 
              className="grid grid-cols-1 lg:grid-cols-5 items-center gap-8"
              initial="initial"
              whileInView="animate"
              variants={staggerContainer}
              viewport={{ once: true, amount: 0.4 }}
            >
              <motion.div 
                className="lg:col-span-3"
                variants={fadeIn}
              >
                <img src={pictureUrl} alt="Jim and Arabelle" className="rounded-3xl shadow-2xl w-full h-auto object-cover border-8 border-white/10"/>
              </motion.div>
              <motion.div 
                className="lg:col-span-2 lg:-ml-24"
                variants={fadeIn}
              >
                <div className="bg-black/30 backdrop-blur-sm p-8 md:p-12 rounded-3xl border border-white/20 shadow-lg text-white">
                  <h2 className=" text-6xl md:text-7xl text-transparent bg-clip-text bg-gradient-to-r from-rose-200 via-pink-300 to-red-400 mb-8">
                    Our Story
                  </h2>
                  <div className="space-y-6 text-lg text-white/80 leading-relaxed">
                    <p>It all started on a quiet Tuesday at a local coffee shop. Arabelle was sketching in her notebook, and Jim, captivated by her focus, found the courage to say hello...</p>
                    <p>From that day forward, our adventure began. We've explored mountains, discovered hidden cafes, and built a life filled with love, support, and endless cups of coffee...</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        <section id="details" className="min-h-screen p-4 sm:p-8 py-32 relative">
          <div className="container mx-auto text-center text-white">
            <motion.h2 
              className=" text-6xl md:text-7xl text-transparent bg-clip-text bg-gradient-to-r from-rose-200 via-pink-300 to-red-400 mb-16"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              Wedding Details
            </motion.h2>
            <motion.div 
              className="grid md:grid-cols-3 gap-8 mb-16"
              initial="initial"
              whileInView="animate"
              variants={staggerContainer}
              viewport={{ once: true, amount: 0.5 }}
            >
              {[
                { icon: <BellRing className="h-12 w-12 text-rose-300 mx-auto mb-4"/>, title: "Ceremony", venue: ceremonyVenue, date: weddingDate, time: weddingTime },
                { icon: <PartyPopper className="h-12 w-12 text-rose-300 mx-auto mb-4"/>, title: "Reception", venue: receptionVenue, date: receptionAddress, time: "Dinner & Celebration" },
                { icon: <Users className="h-12 w-12 text-rose-300 mx-auto mb-4"/>, title: "Dress Code", venue: "Formal Attire", date: "Colors: Soft pastels & neutrals", time: <br/> }
              ].map((detail) => (
                <motion.div variants={fadeIn} key={detail.title} className="h-full">
                  <Card className="h-full bg-black/20 backdrop-blur-sm border border-white/20 shadow-xl transition-all duration-300 hover:border-rose-300/50 hover:-translate-y-2">
                    <CardHeader>
                      {detail.icon}
                      <CardTitle className=" text-3xl text-rose-300">{detail.title}</CardTitle>
                      <CardDescription className="text-white/80 text-lg">{detail.venue}</CardDescription>
                    </CardHeader>
                    <CardContent className="text-white/70 text-lg">
                      <p>{detail.date}</p>
                      <p>{detail.time}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
            <div className="rounded-3xl overflow-hidden border-2 border-white/20 shadow-xl">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3859.9726719684096!2d120.97377417510341!3d14.58975667797147!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3397ca29ffbd31d5%3A0x41bdbf2da6adfdd4!2sManila%2sCathedral!5e0!3m2!1sen!2sph!4v1692401703123!5m2!1sen!2sph"
                width="100%" height="450" allowFullScreen loading="lazy" className="w-full">
              </iframe>
            </div>
          </div>
        </section>

        <section id="gallery" className="min-h-screen p-4 sm:p-8 py-32 relative">
          <div className="container mx-auto text-center">
            <h2 className="text-6xl md:text-7xl text-transparent bg-clip-text bg-gradient-to-r from-pink-300 via-rose-400 to-red-500 mb-16">
              Our Moments
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 auto-rows-[200px] gap-4">
              {galleryImages.map((image, i) => (
                <motion.div
                  key={i}
                  className={`overflow-hidden rounded-2xl shadow-lg group relative cursor-pointer ${image.layout}`}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: i * 0.05 }}
                  viewport={{ once: true }}
                  onClick={() => setSelectedImage(image.src)}
                >
                  <img src={image.src} alt={image.alt} className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"/>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-start p-4">
                    <Camera className="h-8 w-8 text-white/90 drop-shadow-lg"/>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
        
        <section id="faqs" className="flex items-center justify-center min-h-screen p-4 sm:p-8 py-32 relative">
          <div className="container mx-auto max-w-4xl text-white">
            <h2 className=" text-6xl md:text-7xl text-center text-transparent bg-clip-text bg-gradient-to-r from-rose-300 via-pink-400 to-red-500 mb-16">
              Questions & Answers
            </h2>
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              viewport={{ once: true }}
              className="bg-black/20 backdrop-blur-2xl rounded-3xl border border-white/20 shadow-2xl p-6 md:p-10"
            >
              <Accordion type="single" collapsible className="w-full">
                {faqData.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`} className="border-white/20 last:border-b-0">
                    <AccordionTrigger className="text-left text-lg md:text-xl font-semibold text-white/90 hover:no-underline hover:text-rose-300 transition-colors py-6">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-base md:text-lg text-white/70 pt-2 pb-6 leading-relaxed">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </motion.div>
          </div>
        </section>

         <section id="registry" className="flex items-center justify-center min-h-screen p-4 sm:p-8 py-32 relative">
        <div className="container mx-auto max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
            className="bg-black/20 backdrop-blur-2xl rounded-3xl border border-white/20 shadow-2xl p-8 md:p-12"
          >
            <h2 className=" text-5xl md:text-6xl text-center text-transparent bg-clip-text bg-gradient-to-r from-rose-300 via-pink-400 to-red-500 mb-8">
              Guest Registry
            </h2>
            <p className="text-center text-white/80 text-xl mb-10">
              We would love to know if you can celebrate with us.<br />Please fill out the form below 💌
            </p>
            
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-white/70 mb-2">Full Name</label>
                  <input 
                    type="text" 
                    name="FullName"
                    value={formData.FullName}
                    onChange={handleInputChange}
                    className="w-full px-5 py-3 rounded-xl bg-white/10 text-white placeholder-white/50 border border-white/20 focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-rose-400 transition-all" 
                    placeholder="Your Name" 
                    required
                  />
                </div>
                <div>
                  <label className="block text-white/70 mb-2">Email</label>
                  <input 
                    type="email" 
                    name="Email"
                    value={formData.Email}
                    onChange={handleInputChange}
                    className="w-full px-5 py-3 rounded-xl bg-white/10 text-white placeholder-white/50 border border-white/20 focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-rose-400 transition-all" 
                    placeholder="you@example.com" 
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-white/70 mb-2">Message</label>
                <textarea 
                  rows={4} 
                  name="Message"
                  value={formData.Message}
                  onChange={handleInputChange}
                  className="w-full px-5 py-3 rounded-xl bg-white/10 text-white placeholder-white/50 border border-white/20 focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-rose-400 transition-all" 
                  placeholder="Leave a sweet message for the couple..."
                ></textarea>
              </div>
              <div className="flex flex-col items-center justify-center pt-4">
                <Button 
                  type="submit" 
                  className="px-10 py-7 rounded-full shadow-lg text-xl bg-gradient-to-r from-rose-500 to-red-500 hover:shadow-rose-400/40 hover:scale-105 transition-all duration-300 flex items-center gap-2" 
                  size="lg"
                  disabled={isSubmitting}
                >
                  <Send className="h-5 w-5"/>
                  {isSubmitting ? 'Submitting...' : 'Submit'}
                </Button>
                {submitStatus && (
                  <p className="mt-6 text-center text-rose-200">{submitStatus}</p>
                )}
              </div>
            </form>
          </motion.div>
        </div>
      </section>
      </div>
      
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-lg flex items-center justify-center p-4"
            onClick={() => setSelectedImage(null)}
          >
            <button 
              onClick={(e) => { e.stopPropagation(); handlePrevImage(); }} 
              className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors"
            >
              <ArrowLeft className="h-8 w-8 text-white" />
            </button>
            <motion.img
              layoutId={selectedImage}
              src={selectedImage}
              alt="Selected wedding moment"
              className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
            <button 
              onClick={(e) => { e.stopPropagation(); handleNextImage(); }} 
              className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors"
            >
              <ArrowRight className="h-8 w-8 text-white" />
            </button>
            <button 
              onClick={() => setSelectedImage(null)} 
              className="absolute top-4 right-4 z-10 p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors"
            >
              <X className="h-8 w-8 text-white" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
      
      <AnimatePresence>
        {scrolled && (
          <motion.button
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            transition={{ duration: 0.5 }}
            onClick={scrollToTop}
            className="fixed bottom-8 right-8 z-[60] p-3 bg-black/30 backdrop-blur-lg border border-white/20 rounded-full text-white hover:bg-white/20 transition-colors shadow-lg"
            aria-label="Scroll to top"
          >
            <ChevronUp className="h-6 w-6" />
          </motion.button>
        )}
      </AnimatePresence>

      <footer className="relative z-10 py-10 border-t border-white/10 bg-black/30 backdrop-blur-lg">
        <div className="container mx-auto text-center text-white/70">
          <div className="flex justify-center items-center gap-2">
            <p className=" text-3xl">Jim</p>
            <Heart className="h-5 w-5 text-rose-400" />
            <p className=" text-3xl">Arabelle</p>
          </div>
          <p className="mt-4 text-sm uppercase tracking-widest">Forever & Always • February 14, 2026</p>
        </div>
      </footer>
    </div>
  );
}

export default Homepage;