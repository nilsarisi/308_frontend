import React from "react";
import logo from "../assets/logo.png"; // Assuming you have a logo file in your assets folder

const About = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header Section */}
      <div className="text-center">
        <img src={logo} alt="Vegan Eats Logo" className="w-32 h-32 mx-auto mb-4" />
        <h1 className="text-4xl font-bold text-green-800">About Vegan Eats</h1>
        <p className="text-lg text-gray-700 mt-2">
          Your gateway to a plant-based lifestyle.
        </p>
      </div>

      {/* Mission Section */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold text-green-700">Our Mission</h2>
        <p className="text-gray-700 mt-4">
          At Vegan Eats, we are committed to making a plant-based lifestyle
          accessible and enjoyable for everyone. Whether you’re a lifelong vegan
          or just exploring plant-based options, our mission is to provide you with
          high-quality, eco-friendly, and cruelty-free products that align with
          your values.
        </p>
      </div>

      {/* Values Section */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold text-green-700">Our Values</h2>
        <ul className="list-disc pl-6 mt-4 text-gray-700">
          <li>
            <strong>Compassion:</strong> We believe in kindness towards all living
            beings.
          </li>
          <li>
            <strong>Sustainability:</strong> Our products are chosen with the
            planet in mind.
          </li>
          <li>
            <strong>Health:</strong> We promote a healthy, plant-based lifestyle.
          </li>
          <li>
            <strong>Community:</strong> We support and connect with like-minded
            individuals.
          </li>
        </ul>
      </div>

      {/* Story Section */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold text-green-700">Our Story</h2>
        <p className="text-gray-700 mt-4">
          Vegan Eats began as a passion project by a group of friends who were
          inspired to make plant-based living more accessible. Over the years, we’ve
          grown into a trusted destination for vegan food, cosmetics, and cleaning
          products. With a focus on quality and sustainability, our curated
          selection of products helps you live in harmony with nature and your
          values.
        </p>
      </div>

      {/* Call-to-Action Section */}
      <div className="mt-8 text-center">
        <h2 className="text-2xl font-bold text-green-700">
          Join the Vegan Eats Community
        </h2>
        <p className="text-gray-700 mt-4">
          Together, we can make a difference. Explore our products, discover
          new recipes, and join us in creating a sustainable and compassionate world.
        </p>
        <a
          href="/products"
          className="inline-block mt-6 bg-green-700 text-white px-6 py-2 rounded-lg shadow-md hover:bg-green-600"
        >
          Shop Now
        </a>
      </div>
    </div>
  );
};

export default About;