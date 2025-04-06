"use client";

import { useState, useEffect } from "react";
import { FaTimes } from "react-icons/fa";
import { checkBandExists, addBand } from "../services/api";
import { AuthClient } from "@dfinity/auth-client"; // Nowy import dla ICP
import { useRouter } from "next/navigation";
import { Button } from "@mantine/core"; // Używamy Button z Mantine zamiast @burnt-labs/ui

const metalGenres = {
  "Black Metal": [
    "Black Metal",
    "Ambient Black Metal",
    "Atmospheric Black Metal",
    "Avant-Garde Black Metal",
    "Blackened Crust",
    "Blackened Death Metal",
    "Blackened Doom Metal",
    "Blackened Thrash Metal",
    "Blackgaze",
    "Depressive Suicidal Black Metal (DSBM)",
    "Folk Black Metal",
    "Identity Black Metal",
    "Industrial Black Metal",
    "National Socialist Black Metal (NSBM)",
    "Pagan Black Metal",
    "Post-Black Metal",
    "Progressive Black Metal",
    "Proto-Black Metal",
    "Psychedelic Black Metal",
    "Raw Black Metal",
    "Slavonic Black Metal",
    "Symphonic Black Metal",
    "Traditional Black Metal",
    "Viking Black Metal",
    "War Black Metal (Bestial Black Metal)"
  ].sort(),
  "Death Metal": [
    "Death Metal",
    "Atmospheric Death Metal",
    "Blackened Death Metal",
    "Brutal Death Metal",
    "Cavernous Death Metal",
    "Death Doom Metal",
    "Death Thrash Metal",
    "Deathcore",
    "Deathgrind",
    "Goregrind (with death metal influences)",
    "Industrial Death Metal",
    "Melodic Death Metal",
    "Old School Death Metal",
    "Progressive Death Metal",
    "Slam Death Metal",
    "Symphonic Death Metal",
    "Technical Death Metal"
  ].sort()
};

const countries = [
  "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua and Barbuda", "Argentina",
  "Armenia", "Australia", "Austria", "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados",
  "Belarus", "Belgium", "Belize", "Benin", "Bhutan", "Bolivia", "Bosnia and Herzegovina", "Botswana",
  "Brazil", "Brunei", "Bulgaria", "Burkina Faso", "Burundi", "Cabo Verde", "Cambodia", "Cameroon",
  "Canada", "Central African Republic", "Chad", "Chile", "China", "Colombia", "Comoros",
  "Congo (Congo-Brazzaville)", "Costa Rica", "Croatia", "Cuba", "Cyprus", "Czechia", "Denmark",
  "Djibouti", "Dominica", "Dominican Republic", "East Timor (Timor-Leste)", "Ecuador", "Egypt",
  "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Eswatini", "Ethiopia", "Fiji",
  "Finland", "France", "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Greece", "Grenada",
  "Guatemala", "Guinea", "Guinea-Bissau", "Guyana", "Haiti", "Honduras", "Hungary", "Iceland",
  "India", "Indonesia", "Iran", "Iraq", "Ireland", "Israel", "Italy", "Jamaica", "Japan",
  "Jordan", "Kazakhstan", "Kenya", "Kiribati", "Korea, North", "Korea, South", "Kosovo", "Kuwait",
  "Kyrgyzstan", "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein",
  "Lithuania", "Luxembourg", "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta",
  "Marshall Islands", "Mauritania", "Mauritius", "Mexico", "Micronesia", "Moldova", "Monaco",
  "Mongolia", "Montenegro", "Morocco", "Mozambique", "Myanmar (Burma)", "Namibia", "Nauru",
  "Nepal", "Netherlands", "New Zealand", "Nicaragua", "Niger", "Nigeria", "North Macedonia",
  "Norway", "Oman", "Pakistan", "Palau", "Palestine", "Panama", "Papua New Guinea", "Paraguay",
  "Peru", "Philippines", "Poland", "Portugal", "Qatar", "Romania", "Russia", "Rwanda",
  "Saint Kitts and Nevis", "Saint Lucia", "Saint Vincent and the Grenadines", "Samoa", "San Marino",
  "Sao Tome and Principe", "Saudi Arabia", "Senegal", "Serbia", "Seychelles", "Sierra Leone",
  "Singapore", "Slovakia", "Slovenia", "Solomon Islands", "Somalia", "South Africa", "South Sudan",
  "Spain", "Sri Lanka", "Sudan", "Suriname", "Sweden", "Switzerland", "Syria", "Taiwan",
  "Tajikistan", "Tanzania", "Thailand", "Togo", "Tonga", "Trinidad and Tobago", "Tunisia",
  "Turkey", "Turkmenistan", "Tuvalu", "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom",
  "United States", "Uruguay", "Uzbekistan", "Vanuatu", "Vatican City", "Venezuela", "Vietnam",
  "Yemen", "Zambia", "Zimbabwe",
].sort();

export default function AddBandForm({
  onClose,
  onSubmit,
  bech32Address, // Zachowujemy prop, ale traktujemy jako principal z ICP
}: {
  onClose: () => void;
  onSubmit: (data: { band: any; txHash: string | null }) => void;
  bech32Address: string; // Teraz to principal
}) {
  const initialBandData = {
    name: "",
    genre: "",
    country: "",
    yearFounded: "",
    logoFile: null as File | null,
  };

  const router = useRouter();
  const [bandData, setBandData] = useState(initialBandData);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [logoError, setLogoError] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [nonCommercialConfirmed, setNonCommercialConfirmed] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Sprawdzenie autoryzacji ICP
  useEffect(() => {
    const checkAuth = async () => {
      const authClient = await AuthClient.create();
      if (await authClient.isAuthenticated()) {
        setIsAuthenticated(true);
      } else {
        router.push("/"); // Przekierowanie, jeśli nie zalogowany
      }
    };
    checkAuth();
  }, [router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setBandData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
    setLogoError("");
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      if (file.size > 200 * 1024) {
        setLogoError("Logo size must be under 200 KB");
        setBandData((prev) => ({ ...prev, logoFile: null }));
      } else {
        setLogoError("");
        setBandData((prev) => ({ ...prev, logoFile: file }));
      }
    } else {
      setBandData((prev) => ({ ...prev, logoFile: null }));
    }
  };

  const handleNonCommercialChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNonCommercialConfirmed(e.target.checked);
  };

  const validateForm = async () => {
    const newErrors: { [key: string]: string } = {};
    if (!bandData.name.trim()) newErrors.name = "Band name is required";
    if (!bandData.genre.trim()) newErrors.genre = "Genre is required";
    if (!bandData.country.trim()) newErrors.country = "Country is required";
    if (
      !bandData.yearFounded ||
      isNaN(Number(bandData.yearFounded)) ||
      Number(bandData.yearFounded) < 1900 ||
      Number(bandData.yearFounded) > new Date().getFullYear()
    ) {
      newErrors.yearFounded = `Valid year (1900–${new Date().getFullYear()}) is required`;
    }
    if (bandData.logoFile && !nonCommercialConfirmed) {
      newErrors.nonCommercial = "Please confirm non-commercial use of the logo";
    }

    try {
      const exists = await checkBandExists(bandData.name);
      if (exists) {
        newErrors.name = "This band already exists in the database";
      }
    } catch (error) {
      newErrors.general = "Error checking band existence";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0 && !logoError;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTxHash(null);

    try {
      if (await validateForm()) {
        const bandPayload = {
          name: bandData.name,
          genre: bandData.genre,
          country: bandData.country,
          year_founded: Number(bandData.yearFounded),
          logo_file: bandData.logoFile || undefined,
        };

        console.log("Submitting band payload:", bandPayload);

        // Pobieramy tożsamość z ICP
        const authClient = await AuthClient.create();
        const identity = authClient.getIdentity();
        const principal = identity.getPrincipal().toString();

        // Zakładamy, że addBand zapisuje dane i zwraca obiekt z nowym zespołem
        const newBand = await addBand(bandPayload, principal);

        console.log("New band returned from addBand:", newBand);

        // Tutaj normalnie użylibyśmy canister ICP do zapisu na blockchainie.
        // Na razie symulujemy txHash, bo nie mamy jeszcze canistera.
        const txHashResult = "ICP_TX_" + Math.random().toString(36).substring(2); // Placeholder
        setTxHash(txHashResult);

        setIsSubmitted(true);
        onSubmit({ band: newBand, txHash: txHashResult });

        if (newBand.id) {
          console.log("Attempting to redirect to:", `/band/${newBand.id}`);
          await router.push(`/band/${newBand.id}`);
        } else {
          console.error("New band ID is missing in the response from addBand");
          onClose();
        }
      }
    } catch (error: any) {
      console.error("Error submitting band:", error);
      setErrors((prev) => ({ ...prev, general: error.message || "Failed to add band" }));
      onClose();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-b from-[#1a1a1a] to-[#0d0d0d] p-6 rounded-lg shadow-metal border border-[#3a1c1c] w-full max-w-md text-[#b0b0b0] font-russo">
        <div className="relative">
          <h2
            className="text-2xl font-unbounded text-[#d0d0d0] uppercase tracking-wide mb-4"
            style={{ textShadow: "0 0 5px rgba(138, 74, 74, 0.3)" }}
          >
            Add New Band
          </h2>
          <button
            onClick={onClose}
            className="absolute top-2 right-2 text-[#8a8a8a] hover:text-[#d0d0d0] transition duration-300"
            aria-label="Close form"
            disabled={isLoading}
          >
            <FaTimes size={24} />
          </button>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm text-[#d0d0d0] mb-1">
                Band Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={bandData.name}
                onChange={handleChange}
                className="w-full p-3 bg-gradient-to-b from-[#1a1a1a] to-[#0d0d0d] text-[#b0b0b0] rounded-lg border border-[#3a1c1c] shadow-metal focus:outline-none focus:ring-2 focus:ring-[#8a4a4a] transition duration-300"
                placeholder="e.g., Slayer"
                disabled={isLoading}
                required
              />
              {errors.name && <p className="text-[#8a4a4a] text-sm mt-1">{errors.name}</p>}
            </div>

            <div>
              <label htmlFor="genre" className="block text-sm text-[#d0d0d0] mb-1">
                Genre
              </label>
              <select
                id="genre"
                name="genre"
                value={bandData.genre}
                onChange={handleChange}
                className="w-full p-3 bg-gradient-to-b from-[#1a1a1a] to-[#0d0d0d] text-[#b0b0b0] rounded-lg border border-[#3a1c1c] shadow-metal focus:outline-none focus:ring-2 focus:ring-[#8a4a4a] transition duration-300"
                disabled={isLoading}
              >
                <option value="">Select a genre</option>
                {Object.entries(metalGenres).map(([category, genres]) => (
                  <optgroup key={category} label={category}>
                    {genres.map((genre) => (
                      <option key={genre} value={genre}>
                        {genre}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
              {errors.genre && <p className="text-[#8a4a4a] text-sm mt-1">{errors.genre}</p>}
            </div>

            <div>
              <label htmlFor="country" className="block text-sm text-[#d0d0d0] mb-1">
                Country
              </label>
              <select
                id="country"
                name="country"
                value={bandData.country}
                onChange={handleChange}
                className="w-full p-3 bg-gradient-to-b from-[#1a1a1a] to-[#0d0d0d] text-[#b0b0b0] rounded-lg border border-[#3a1c1c] shadow-metal focus:outline-none focus:ring-2 focus:ring-[#8a4a4a] transition duration-300"
                disabled={isLoading}
              >
                <option value="">Select a country</option>
                {countries.map((country) => (
                  <option key={country} value={country}>
                    {country}
                  </option>
                ))}
              </select>
              {errors.country && <p className="text-[#8a4a4a] text-sm mt-1">{errors.country}</p>}
            </div>

            <div>
              <label htmlFor="yearFounded" className="block text-sm text-[#d0d0d0] mb-1">
                Year Founded
              </label>
              <input
                type="number"
                id="yearFounded"
                name="yearFounded"
                value={bandData.yearFounded}
                onChange={handleChange}
                className="w-full p-3 bg-gradient-to-b from-[#1a1a1a] to-[#0d0d0d] text-[#b0b0b0] rounded-lg border border-[#3a1c1c] shadow-metal focus:outline-none focus:ring-2 focus:ring-[#8a4a4a] transition duration-300"
                placeholder={`1900–${new Date().getFullYear()}`}
                disabled={isLoading}
                required
              />
              {errors.yearFounded && <p className="text-[#8a4a4a] text-sm mt-1">{errors.yearFounded}</p>}
            </div>

            <div>
              <label htmlFor="logo" className="block text-sm text-[#d0d0d0] mb-1">
                Logo (Max 200 KB, Optional)
              </label>
              <input
                type="file"
                id="logo"
                name="logo"
                accept="image/*"
                onChange={handleFileChange}
                className="w-full p-3 bg-gradient-to-b from-[#1a1a1a] to-[#0d0d0d] text-[#b0b0b0] rounded-lg border border-[#3a1c1c] shadow-metal focus:outline-none focus:ring-2 focus:ring-[#8a4a4a] transition duration-300 file:bg-[#3a1c1c] file:text-[#d0d0d0] file:border-none file:px-4 file:py-1 file:rounded-lg"
                disabled={isLoading}
              />
              {logoError && <p className="text-[#8a4a4a] text-sm mt-1">{logoError}</p>}
              {bandData.logoFile && (
                <>
                  <img
                    src={URL.createObjectURL(bandData.logoFile)}
                    alt="Preview"
                    className="mt-2 w-32 h-32 object-cover rounded-lg border border-[#3a1c1c]"
                  />
                  <label className="flex items-center text-[#b0b0b0] font-russo text-sm mt-2">
                    <input
                      type="checkbox"
                      checked={nonCommercialConfirmed}
                      onChange={handleNonCommercialChange}
                      className="mr-2 accent-[#8a4a4a]"
                      disabled={isLoading}
                    />
                    I confirm that the logo is used for non-commercial and fan purposes only.
                  </label>
                  {errors.nonCommercial && (
                    <p className="text-[#8a4a4a] text-sm mt-1">{errors.nonCommercial}</p>
                  )}
                </>
              )}
            </div>

            {errors.general && <p className="text-[#8a4a4a] text-sm mt-1">{errors.general}</p>}
            {txHash && <p className="text-[#d0d0d0] text-sm mt-1">Transaction Hash: {txHash}</p>}

            <div className="flex justify-end gap-4">
              <Button
                onClick={onClose}
                className="px-6 py-3 bg-gradient-to-r from-[#1a1a1a] to-[#0d0d0d] text-[#d0d0d0] rounded-lg border border-[#3a1c1c] hover:bg-gradient-to-r hover:from-[#2a2a2a] hover:to-[#1f1f1f] transition duration-300 shadow-metal disabled:opacity-60"
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="px-6 py-3 bg-gradient-to-r from-[#3a1c1c] to-[#1a1a1a] text-[#d0d0d0] rounded-lg hover:from-[#5a2e2e] hover:to-[#2a2a2a] transition duration-300 shadow-metal disabled:opacity-60"
                disabled={isLoading || !isAuthenticated}
              >
                {isLoading ? "Adding..." : "Add Band"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}