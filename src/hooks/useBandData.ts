// hooks/useBandData.ts
import { useState, useEffect, useCallback } from "react";
import { fetchBandDetails, fetchUserUsername } from "../services/bandService";
import { Band, Member, Album, Link, BandDetailsResponse } from "../types/bandTypes";

export const useBandData = (id: string) => {
  const [band, setBand] = useState<Band | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [pastMembers, setPastMembers] = useState<Member[]>([]);
  const [albums, setAlbums] = useState<Album[]>([]);
  const [links, setLinks] = useState<Link[]>([]);
  const [addedByUsername, setAddedByUsername] = useState<string | null>(null);
  const [updatedByUsername, setUpdatedByUsername] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async (isInitialLoad = false) => {
    if (!id) return;
    if (isInitialLoad) setIsLoading(true);
    try {
      const data: BandDetailsResponse = await fetchBandDetails(id);
      setBand(data.band);
      setMembers(data.members || []);
      setPastMembers(data.pastMembers || []);
      setAlbums(
        (data.albums || []).sort((a, b) =>
          new Date(b.release_date || "9999-12-31").getTime() -
          new Date(a.release_date || "9999-12-31").getTime()
        )
      );
      setLinks(data.links || []);

      if (data.band.added_by) {
        const username = await fetchUserUsername(data.band.added_by);
        setAddedByUsername(username);
      }
      if (data.band.updated_by) {
        const username = await fetchUserUsername(data.band.updated_by);
        setUpdatedByUsername(username);
      } else {
        setUpdatedByUsername(null);
      }
    } catch (error) {
      console.error("Error fetching band details:", error);
      if (error.message.includes("404")) {
        setBand(null); // Resetuj band, jeśli nie istnieje
        setError("Band not found");
      } else {
        setError("Error loading band details");
      }
    } finally {
      if (isInitialLoad) setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (id) fetchData(true);
  }, [id, fetchData]);

  return {
    band,
    members,
    pastMembers,
    albums,
    links,
    addedByUsername,
    updatedByUsername,
    isLoading,
    error,
    fetchBandDetails: fetchData,
    setBand,
    setMembers,
    setPastMembers,
    setAlbums,
    setLinks,
  };
};