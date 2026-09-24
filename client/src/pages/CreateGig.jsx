import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createGig } from "../service/service";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorMessage from "../components/ErrorMessage";

const CreateGig = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    budget: "",
    slug: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  };

  const handleTitleChange = (e) => {
    const newTitle = e.target.value;
    setFormData({ 
      ...formData, 
      title: newTitle,
      slug: generateSlug(newTitle)
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title || !formData.description || !formData.budget) {
      setError("Please fill all the required fields");
      return;
    }

    if (formData.title.trim().length < 10) {
      setError("Title must be at least 10 characters long");
      return;
    }

    if (formData.description.trim().length < 50) {
      setError("Description must be at least 50 characters long");
      return;
    }

    if (formData.budget < 1) {
      setError("Budget must be greater than 0");
      return;
    }

    if (!formData.slug || formData.slug.trim().length < 3) {
      setError("Slug must be at least 3 characters long");
      return;
    }

    try {
      setIsLoading(true);
      setError("");

      const response = await createGig(
        formData.title,
        formData.description,
        formData.budget,
        formData.slug
      );

      navigate("/my-gigs");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create gig");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <section className="bg-gradient-to-r from-royal-blue to-royal-blue/90 py-12 px-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-bone mb-4">
            Post a New Job
          </h1>
          <p className="text-xl text-powder-blue">
            Find the perfect freelancer for your project
          </p>
        </div>
      </section>

      <section className="flex-1 bg-bone py-12 px-6">
        <div className="max-w-4xl mx-auto">
          {isLoading ? (
            <LoadingSpinner />
          ) : (
            <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 border-2 border-powder-blue">
              {error && <ErrorMessage message={error} />}

              <form onSubmit={handleSubmit} className="space-y-8">
                <div>
                  <label
                    htmlFor="title"
                    className="block text-royal-blue font-bold text-lg mb-3"
                  >
                    Job Title <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    id="title"
                    value={formData.title}
                    onChange={handleTitleChange}
                    placeholder="e.g. Full Stack Web Application Development"
                    className="w-full px-4 py-3 border-2 border-powder-blue rounded-lg focus:border-royal-blue focus:outline-none transition-colors duration-200 text-royal-blue"
                  />
                  <p className="text-sm text-royal-blue opacity-70 mt-2">
                    Write a clear, descriptive title for your project
                  </p>
                </div>

                <div>
                  <label
                    htmlFor="slug"
                    className="block text-royal-blue font-bold text-lg mb-3"
                  >
                    URL Slug <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    id="slug"
                    value={formData.slug}
                    onChange={(e) =>
                      setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/\s+/g, "-") })
                    }
                    placeholder="e.g. full-stack-web-application-development"
                    className="w-full px-4 py-3 border-2 border-powder-blue rounded-lg focus:border-royal-blue focus:outline-none transition-colors duration-200 text-royal-blue"
                  />
                  <p className="text-sm text-royal-blue opacity-70 mt-2">
                    Auto-generated from title. You can edit it manually. Use hyphens instead of spaces.
                  </p>
                </div>

                <div>
                  <label
                    htmlFor="description"
                    className="block text-royal-blue font-bold text-lg mb-3"
                  >
                    Project Description <span className="text-red-600">*</span>
                  </label>
                  <textarea
                    id="description"
                    rows="10"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    placeholder="Describe your project in detail. Include requirements, skills needed, deliverables, timeline, and any other relevant information..."
                    className="w-full px-4 py-3 border-2 border-powder-blue rounded-lg focus:border-royal-blue focus:outline-none transition-colors duration-200 text-royal-blue resize-none"
                  ></textarea>
                  <p className="text-sm text-royal-blue opacity-70 mt-2">
                    Minimum 50 characters. Be as detailed as possible to attract
                    the right talent.
                  </p>
                </div>

                <div>
                  <label
                    htmlFor="budget"
                    className="block text-royal-blue font-bold text-lg mb-3"
                  >
                    Budget (USD) <span className="text-red-600">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-royal-blue font-bold text-xl">
                      $
                    </span>
                    <input
                      type="number"
                      id="budget"
                      value={formData.budget}
                      onChange={(e) =>
                        setFormData({ ...formData, budget: e.target.value })
                      }
                      placeholder="5000"
                      className="w-full pl-10 pr-4 py-3 border-2 border-powder-blue rounded-lg focus:border-royal-blue focus:outline-none transition-colors duration-200 text-royal-blue text-xl"
                    />
                  </div>
                  <p className="text-sm text-royal-blue opacity-70 mt-2">
                    Set a realistic budget for your project
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 pt-6">
                  <button
                    type="submit"
                    className="bg-royal-blue text-bone px-8 py-3 rounded-lg font-bold text-lg hover:bg-opacity-90 transition-all duration-200 shadow-lg cursor-pointer"
                  >
                    Post Job
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate("/gigs")}
                    className="border-2 border-powder-blue text-royal-blue px-8 py-3 rounded-lg font-bold text-lg hover:bg-powder-blue transition-all duration-200 cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default CreateGig;
