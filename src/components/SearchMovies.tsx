import React, { useState, useEffect } from "react";
import { Box, Grid, Input, Button, Heading, Skeleton } from "@chakra-ui/react";
import axios from "axios";
import MovieCard from "./MovieCard";

interface Movie {
  imdbID: string;
  Title: string;
  Poster: string;
  Year: string;
  Rated?: string;
}

const SearchMovies: React.FC = () => {
  const [query, setQuery] = useState<string>("");
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false); // Loading state

  const API_KEY = import.meta.env.VITE_OMDB_API_KEY;

  // Fetch initial movies from 2024 on component mount
  const fetchInitialMovies = async () => {
    setIsLoading(true);
    const response = await axios.get(
      `http://www.omdbapi.com/?s=movie&y=2024&apikey=${API_KEY}`
    );
    const initialMovies = response.data.Search || [];
    setMovies(initialMovies);
    setIsLoading(false);
  };

  // Handle search submission, fetching movies based on user query
  const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true); // Start loading on search submit
    const response = await axios.get(
      `http://www.omdbapi.com/?s=${query}&apikey=${API_KEY}`
    );
    const searchMovies = response.data.Search || [];
    setMovies(searchMovies);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchInitialMovies();
  }, []);

  return (
    <Box
      maxW="1000px"
      mx="auto"
      py={8}
      px={{ base: 4, md: 0 }}>
      {/* Header */}
      <Heading
        as="h1"
        textAlign="center"
        mb={4}>
        Movie Search
      </Heading>

      {/* Search Form */}
      <Box
        as="form"
        onSubmit={handleSearch}
        display="flex"
        flexDirection={{ base: "column", md: "row" }}
        alignItems="center"
        mb={12}
        maxW="600px"
        mx="auto">
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for a movie"
          size="lg"
          borderColor="gray.300"
          flex="1"
          width={{ base: "100%", md: "auto" }}
          maxW="400px"
          minHeight="48px"
          mb={{ base: 4, md: 0 }}
          mr={{ base: 0, md: 2 }}
        />
        <Button
          type="submit"
          colorScheme="blue"
          size="lg"
          width={{ base: "100%", md: "auto" }}
          maxW={{ base: "400px", md: "150px" }}>
          Search
        </Button>
      </Box>

      {/* Movie Grid with Skeleton Loading */}
      {isLoading ? (
        <Grid
          templateColumns="repeat(auto-fill, minmax(200px, 1fr))"
          gap={6}>
          {[...Array(6)].map((_, i) => (
            <Skeleton
              key={i}
              height="300px"
              borderRadius="md"
            />
          ))}
        </Grid>
      ) : movies.length > 0 ? (
        <Grid
          templateColumns="repeat(auto-fill, minmax(200px, 1fr))"
          gap={6}
          justifyItems="center"
          alignItems="center">
          {movies.map((movie) => (
            <MovieCard
              key={movie.imdbID}
              movie={movie}
            />
          ))}
        </Grid>
      ) : (
        <Heading
          as="h3"
          size="md"
          textAlign="center">
          No movies found
        </Heading>
      )}
    </Box>
  );
};

export default SearchMovies;
