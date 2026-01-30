// Introduction.tsx
'use client';

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Gamepad2,
  Users,
  Zap,
  Shield,
  Globe,
  Smartphone,
  ChevronRight,
  Play,
  Star,
  TrendingUp,
  Award,
  MessageCircle,
  Mail,
  Phone,
  MapPin,
  Github,
  Twitter,
  Linkedin,
  Menu,
  X,
  ArrowRight,
  Check,
  Sparkles,
  Target,
  Rocket,
  BarChart3
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

// ==================== CONFIGURATION ====================
const CONFIG = {
  companyName: "WaveGames",
  tagline: "Revolutionizing Multi-Platform Gaming",
  description: "Seamlessly integrate engaging games into any application with just 2 APIs. Connect, play, and grow your community.",
  website: "wavegames.online",
  phone: "+923252265427",
  email: "contact@wavegames.online",
  address: "Islamabad, Pakistan",
  social: {
    twitter: "https://twitter.com/wavegames",
    linkedin: "https://linkedin.com/company/wavegames",
    github: "https://github.com/wavegames"
  },
  features: [
    {
      icon: Zap,
      title: "2-API Integration",
      description: "Get started in minutes with our streamlined API. Just two endpoints to unlock unlimited gaming potential.",
      color: "from-yellow-400 to-orange-500"
    },
    {
      icon: Users,
      title: "Multi-User Support",
      description: "Built for communities. Support thousands of concurrent players with real-time synchronization.",
      color: "from-blue-400 to-cyan-500"
    },
    {
      icon: Globe,
      title: "Cross-Platform Ready",
      description: "Works seamlessly in BigoLive, TikTok, Instagram, and any WebView-enabled application.",
      color: "from-purple-400 to-pink-500"
    },
    {
      icon: Shield,
      title: "Enterprise Security",
      description: "Bank-level encryption, DDoS protection, and 99.9% uptime SLA guaranteed.",
      color: "from-green-400 to-emerald-500"
    },
    {
      icon: Smartphone,
      title: "Mobile Optimized",
      description: "Buttery smooth performance on iOS, Android, and web with adaptive UI/UX.",
      color: "from-red-400 to-rose-500"
    },
    {
      icon: BarChart3,
      title: "Real-Time Analytics",
      description: "Track player behavior, revenue, and engagement with our comprehensive dashboard.",
      color: "from-indigo-400 to-violet-500"
    }
  ],
  games: [
    {
      name: "Teen Patti",
      description: "Classic Indian poker with 3-pot betting system",
      image: "🎴",
      players: "50K+",
      rating: 4.8,
      category: "Card Game"
    },
    {
      name: "Greedy Fruits",
      description: "Fast-paced fruit matching with 8 unique pots",
      image: "🍓",
      players: "35K+",
      rating: 4.9,
      category: "Casual"
    },
    {
      name: "Lucky Spin",
      description: "Fortune wheel with customizable rewards",
      image: "🎰",
      players: "28K+",
      rating: 4.7,
      category: "Casino"
    },
    {
      name: "Dragon Tiger",
      description: "Lightning-fast card comparison game",
      image: "🐉",
      players: "42K+",
      rating: 4.8,
      category: "Card Game"
    }
  ],
  stats: [
    { label: "Active Players", value: "1.3K+", icon: Users },
    { label: "Games Integrated", value: "12+", icon: Gamepad2 },
    { label: "Partner Apps", value: "150+", icon: Smartphone },
    { label: "API Uptime", value: "99.9%", icon: TrendingUp }
  ],
  pricing: [
    {
      name: "Starter",
      price: "$99",
      period: "/month",
      description: "Perfect for small communities",
      features: [
        "Up to 1,000 players",
        "3 game integrations",
        "Basic analytics",
        "Email support",
        "99% uptime SLA"
      ],
      popular: false
    },
    {
      name: "Professional",
      price: "$299",
      period: "/month",
      description: "For growing applications",
      features: [
        "Up to 10,000 players",
        "All game integrations",
        "Advanced analytics",
        "Priority support",
        "99.9% uptime SLA",
        "Custom branding",
        "Dedicated account manager"
      ],
      popular: true
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "",
      description: "Unlimited scale & support",
      features: [
        "Unlimited players",
        "Custom game development",
        "White-label solution",
        "24/7 phone support",
        "99.99% uptime SLA",
        "On-premise deployment",
        "Custom integrations"
      ],
      popular: false
    }
  ]
};

// ==================== COMPONENTS ====================

// Navigation Header
const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = ["Features", "Games", "Pricing", "Contact"];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
        ? 'bg-white/80 backdrop-blur-xl shadow-lg border-b border-gray-200'
        : 'bg-transparent'
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <motion.div
            className="flex items-center space-x-3"
            whileHover={{ scale: 1.05 }}
          >
            <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
              <Gamepad2 className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                {CONFIG.companyName}
              </h1>
              <p className="text-xs text-gray-500 hidden sm:block">Multi-Platform Gaming</p>
            </div>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <a
                key={link}
                href={`#${link.toLowerCase()}`}
                className="text-blue-700 font-medium transition-colors relative group no-underline hover:no-underline"
                style={{ textDecoration: 'none' }}
              >
                {link}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-purple-600 group-hover:w-full transition-all duration-300"></span>
              </a>
            ))}

            <a
              href="https://wa.me/923252265427"
              target="_blank"
              rel="noopener noreferrer"
              className="no-underline hover:no-underline"
              style={{ textDecoration: 'none' }}
            >
              <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg">
                Get Started
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </a>
          </div>



          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden pb-6 space-y-4"
          >
            {navLinks.map((link) => (
              <a
                key={link}
                href={`#${link.toLowerCase()}`}
                className="block text-gray-700 hover:text-purple-600 font-medium transition-colors py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link}
              </a>
            ))}
            <Button className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white">
              Get Started
            </Button>
          </motion.div>
        )}
      </div>
    </motion.nav>
  );
};

// Hero Section
const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 pt-20">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
          }}
          transition={{ duration: 20, repeat: Infinity }}
          className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-purple-300/20 to-blue-300/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [90, 0, 90],
          }}
          transition={{ duration: 25, repeat: Infinity }}
          className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-br from-pink-300/20 to-purple-300/20 rounded-full blur-3xl"
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex justify-center mb-8"
        >
          <Badge className="px-6 py-2 text-sm bg-gradient-to-r from-purple-600 to-blue-600 text-white border-0">
            <Sparkles className="w-4 h-4 mr-2" />
            Trusted by 150+ Applications
          </Badge>
        </motion.div>

        {/* Main Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-5xl md:text-7xl font-bold mb-6 leading-tight"
        >
          <span className="bg-gradient-to-r from-purple-600 via-blue-600 to-pink-600 bg-clip-text text-transparent">
            {CONFIG.tagline}
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed"
        >
          {CONFIG.description}
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16"
        >
          <Button
            size="lg"
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-6 text-lg shadow-2xl shadow-purple-500/30 group"
          >
            Start Free Trial
            <Rocket className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="border-2 border-purple-600 text-purple-600 hover:bg-purple-50 px-8 py-6 text-lg group"
          >
            <Play className="mr-2 w-5 h-5 group-hover:scale-110 transition-transform" />
            Watch Demo
          </Button>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto"
        >
          {CONFIG.stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              whileHover={{ scale: 1.05 }}
              className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200"
            >
              <stat.icon className="w-8 h-8 mx-auto mb-3 text-purple-600" />
              <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
      >
        <ChevronRight className="w-6 h-6 text-gray-400 rotate-90" />
      </motion.div>
    </section>
  );
};

// Features Section
const Features = () => {
  return (
    <section id="features" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <Badge className="mb-4 px-4 py-2 bg-purple-100 text-purple-700 border-0">
            <Target className="w-4 h-4 mr-2" />
            Why Choose WaveGames
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Built for Scale, Designed for Simplicity
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Everything you need to launch multiplayer games in your application. No complex setup, no hidden fees.
          </p>
        </motion.div>

        {/* Feature Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {CONFIG.features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
            >
              <Card className="h-full border-2 border-gray-100 hover:border-purple-200 hover:shadow-xl transition-all duration-300 group">
                <CardHeader>
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <feature.icon className="w-7 h-7 text-white" />
                  </div>
                  <CardTitle className="text-xl mb-2">{feature.title}</CardTitle>
                  <CardDescription className="text-base leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Integration Code Preview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-20 bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-8 md:p-12 shadow-2xl"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-white">Start in 2 Minutes</h3>
            <Badge className="bg-green-500 text-white border-0">
              <Check className="w-4 h-4 mr-1" />
              Live
            </Badge>
          </div>
          <pre className="bg-gray-950 rounded-xl p-6 overflow-x-auto text-sm ">
            <code className="text-grey-400">
              {`// Initialize WaveGames SDK
import WaveGames from '@wavegames/sdk';

const wave = new WaveGames({
  apiKey: 'your_api_key',
  gameId: 'teenpatti'
});

// Connect player
await wave.connect(userId, playerData);

// Start game
await wave.startGame();

// That's it! 🎮`}
            </code>
          </pre>
        </motion.div>
      </div>
    </section>
  );
};

// Games Showcase
const Games = () => {
  return (
    <section id="games" className="py-24 bg-gradient-to-br from-gray-50 to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <Badge className="mb-4 px-4 py-2 bg-blue-100 text-blue-700 border-0">
            <Gamepad2 className="w-4 h-4 mr-2" />
            Our Games
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Engaging Games Your Users Will{" "}
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Love
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Professionally designed, rigorously tested, and loved by millions of players worldwide.
          </p>
        </motion.div>

        {/* Games Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {CONFIG.games.map((game, index) => (
            <motion.div
              key={game.name}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -10 }}
            >
              <Card className="overflow-hidden border-2 hover:border-purple-300 hover:shadow-2xl transition-all duration-300 group cursor-pointer">
                {/* Game Icon */}
                <div className="relative h-48 bg-gradient-to-br from-purple-400 to-blue-500 flex items-center justify-center overflow-hidden">
                  <div className="text-8xl group-hover:scale-125 transition-transform duration-500">
                    {game.image}
                  </div>
                  <div className="absolute top-4 right-4">
                    <Badge className="bg-white/90 text-purple-700 border-0">
                      {game.category}
                    </Badge>
                  </div>
                </div>

                <CardHeader>
                  <CardTitle className="text-xl mb-2">{game.name}</CardTitle>
                  <CardDescription className="text-sm mb-4">
                    {game.description}
                  </CardDescription>

                  {/* Stats */}
                  <div className="flex items-center justify-between pt-4 border-t">
                    <div className="flex items-center text-sm text-gray-600">
                      <Users className="w-4 h-4 mr-1" />
                      {game.players}
                    </div>
                    <div className="flex items-center text-sm text-yellow-600">
                      <Star className="w-4 h-4 mr-1 fill-current" />
                      {game.rating}
                    </div>
                  </div>
                </CardHeader>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Button
            size="lg"
            variant="outline"
            className="border-2 border-purple-600 text-purple-600 hover:bg-purple-50"
          >
            View All 12+ Games
            <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

// Pricing Section
const Pricing = () => {
  return (
    <section id="pricing" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <Badge className="mb-4 px-4 py-2 bg-green-100 text-green-700 border-0">
            <Award className="w-4 h-4 mr-2" />
            Transparent Pricing
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Simple Pricing,{" "}
            <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              Powerful Features
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Start free, scale as you grow. No hidden fees, no surprises.
          </p>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8">
          {CONFIG.pricing.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -10 }}
              className="relative"
            >
              {plan.popular && (
                <div className="absolute -top-5 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-gradient-to-r from-purple-600 to-blue-600 text-white border-0 px-4 py-1">
                    Most Popular
                  </Badge>
                </div>
              )}

              <Card className={`h-full ${plan.popular ? 'border-purple-500 border-2 shadow-2xl' : 'border-gray-200'} hover:shadow-xl transition-all duration-300`}>
                <CardHeader>
                  <CardTitle className="text-2xl mb-2">{plan.name}</CardTitle>
                  <CardDescription className="text-sm mb-6">
                    {plan.description}
                  </CardDescription>
                  <div className="mb-6">
                    <span className="text-5xl font-bold text-gray-900">{plan.price}</span>
                    <span className="text-gray-600 ml-2">{plan.period}</span>
                  </div>
                  <Button
                    className={`w-full ${plan.popular ? 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white' : 'bg-gray-100 text-gray-900 hover:bg-gray-200'}`}
                  >
                    {plan.name === "Enterprise" ? "Contact Sales" : "Get Started"}
                  </Button>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start">
                        <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Contact Section
const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log('Form submitted:', formData);
  };

  return (
    <section id="contact" className="py-24 bg-gradient-to-br from-purple-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <Badge className="mb-4 px-4 py-2 bg-purple-100 text-purple-700 border-0">
            <MessageCircle className="w-4 h-4 mr-2" />
            Get In Touch
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Let's Build Something{" "}
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Amazing
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Have questions? Our team is here to help you get started.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <Card className="border-2 border-gray-200 shadow-xl">
              <CardHeader>
                <CardTitle className="text-2xl">Send us a message</CardTitle>
                <CardDescription>We'll get back to you within 24 hours</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Name
                    </label>
                    <Input
                      type="text"
                      placeholder="John Doe"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <Input
                      type="email"
                      placeholder="john@example.com"
                      value={formData.email}
                      onChange={(e: any) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Message
                    </label>
                    <Textarea
                      placeholder="Tell us about your project..."
                      value={formData.message}
                      onChange={(e: any) => setFormData({ ...formData, message: e.target.value })}
                      rows={6}
                      className="w-full"
                      required
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
                  >
                    Send Message
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            {/* Contact Cards */}
            <Card className="border-2 border-gray-200 hover:border-purple-300 transition-all">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Phone className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Phone</h3>
                    <a href={`tel:${CONFIG.phone}`} className="text-purple-600 hover:underline">
                      {CONFIG.phone}
                    </a>
                    <p className="text-sm text-gray-600 mt-1">Mon-Fri, 9am-6pm PKT</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-gray-200 hover:border-purple-300 transition-all">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Mail className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Email</h3>
                    <a href={`mailto:${CONFIG.email}`} className="text-purple-600 hover:underline">
                      {CONFIG.email}
                    </a>
                    <p className="text-sm text-gray-600 mt-1">24/7 support</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-gray-200 hover:border-purple-300 transition-all">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Address</h3>
                    <p className="text-gray-700">{CONFIG.address}</p>
                    <a href={`https://${CONFIG.website}`} className="text-purple-600 hover:underline text-sm mt-1 block">
                      {CONFIG.website}
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Social Links */}
            <div className="flex space-x-4 pt-4">
              <a href={CONFIG.social.twitter} className="w-12 h-12 bg-blue-100 hover:bg-blue-200 rounded-xl flex items-center justify-center transition-colors">
                <Twitter className="w-6 h-6 text-blue-600" />
              </a>
              <a href={CONFIG.social.linkedin} className="w-12 h-12 bg-blue-100 hover:bg-blue-200 rounded-xl flex items-center justify-center transition-colors">
                <Linkedin className="w-6 h-6 text-blue-600" />
              </a>
              <a href={CONFIG.social.github} className="w-12 h-12 bg-gray-100 hover:bg-gray-200 rounded-xl flex items-center justify-center transition-colors">
                <Github className="w-6 h-6 text-gray-900" />
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

// Footer
const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* Company Info */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl flex items-center justify-center">
                <Gamepad2 className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold">{CONFIG.companyName}</h3>
            </div>
            <p className="text-gray-400 mb-4 max-w-md">
              {CONFIG.description}
            </p>
            <div className="flex space-x-4">
              <a href={CONFIG.social.twitter} className="text-gray-400 hover:text-white transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href={CONFIG.social.linkedin} className="text-gray-400 hover:text-white transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href={CONFIG.social.github} className="text-gray-400 hover:text-white transition-colors">
                <Github className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {["Features", "Games", "Pricing", "Documentation", "Support"].map((link) => (
                <li key={link}>
                  <a href={`#${link.toLowerCase()}`} className="text-gray-400 hover:text-white transition-colors">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Contact</h4>
            <ul className="space-y-2 text-gray-400">
              <li className="flex items-center">
                <Phone className="w-4 h-4 mr-2" />
                {CONFIG.phone}
              </li>
              <li className="flex items-center">
                <Mail className="w-4 h-4 mr-2" />
                {CONFIG.email}
              </li>
              <li className="flex items-center">
                <Globe className="w-4 h-4 mr-2" />
                {CONFIG.website}
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © {currentYear} {CONFIG.companyName}. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
              Terms of Service
            </a>
            <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
              Cookie Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

// ==================== MAIN COMPONENT ====================
export default function Introduction() {
  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      <Navigation />
      <Hero />
      <Features />
      <Games />
      <Pricing />
      <Contact />
      <Footer />
    </div>
  );
}