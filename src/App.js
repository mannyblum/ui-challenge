import React, { Component } from 'react';
import './App.css';

const PATH_BASE = 'https://api.themoviedb.org/3';
const PATH_SEARCH = '/movie/popular';
const API_KEY = '676b37a6ad0aaaa61a566c3097c60afe';
const PAGE = 1;

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      result: null,
    };

    this.setPopularMovies = this.setPopularMovies.bind(this);
    this.fetchPopularMovies = this.fetchPopularMovies.bind(this);
  }

  setPopularMovies(result) {
    this.setState({ result: result });
  }

  fetchPopularMovies() {
    // https://api.themoviedb.org/3/movie/popular?api_key=676b37a6ad0aaaa61a566c3097c60afe&page=1
    fetch(`${PATH_BASE}${PATH_SEARCH}?api_key=${API_KEY}&page=${PAGE}`)
      .then(response => response.json())
      .then(result => this.setPopularMovies(result));
  }

  componentDidMount() {
    this.fetchPopularMovies();
  }

  render() {
    const { result } = this.state;

    return (
      <div className="App">
        <h1>Popular</h1>
        { result ? <Movies list={result.results} /> : null }
      </div>
    );
  }
}

const Movies = ({list}) =>
  <div className="movies">
    { list.map((item) =>
        <div key={item.id} className="movie">
          <img src={'https://image.tmdb.org/t/p/w1280/' + item.backdrop_path} alt={item.title} />
        </div>
      )}
  </div>

export default App;
