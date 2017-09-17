import React, { Component } from 'react';
import $ from 'jquery';

import './App.css'; 
const PATH_BASE = 'https://api.themoviedb.org/3';
const PATH_SEARCH = '/movie/popular';
const API_KEY = '676b37a6ad0aaaa61a566c3097c60afe';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      results: null,
      page: 1,
      isLoading: false
    };

    this.setPopularMovies = this.setPopularMovies.bind(this);
    this.fetchPopularMovies = this.fetchPopularMovies.bind(this);

    this.loadMore = this.loadMore.bind(this);
  }

  setPopularMovies(result) {
    this.setState({ results: result.results, isLoading: false });
  }

  fetchPopularMovies(page, isLoadingMore) {
    this.setState({ isLoading: true });

    fetch(`${PATH_BASE}${PATH_SEARCH}?api_key=${API_KEY}&page=${page}`)
      .then(response => response.json())
      .then(result => {
        this.setPopularMovies(result)
      });
  }

  handleScroll(event) {
      var innerHeight = window.innerHeight;
      var scrollTop = $(window).scrollTop();
      var docHeight = $(document).height();
      var totalScrolled = scrollTop + innerHeight;
  }

  componentDidMount() {
    this.fetchPopularMovies(1, false);
  }

  loadMore() {
    this.setState({page: this.state.page + 1});

    // TODO: DRY THIS UP
    fetch(`${PATH_BASE}${PATH_SEARCH}?api_key=${API_KEY}&page=${this.state.page + 1}`)
      .then(response => response.json())
      .then(result => {
        this.setState({ results: this.state.results.concat(result.results) })
      });
  }

  render() {
    const { results, isLoading } = this.state;
    console.log('isLoading', isLoading);
    console.log('results', results);

    if (isLoading) {
      return null;
    }

    return (
      <div className="flix">
        <div className="flix-header">
          <h1>Popular</h1>
        </div>
        { (isLoading || !results) ?
          <Loading /> :
          <Movies list={results} />
        }
        <div className="load-more">
          <Button onClick={this.loadMore}>Load More</Button>
        </div>
      </div>
    );
  }
}

const Loading = () =>
  <div className="movies">
    <h1>Loading ...</h1>
  </div>

const Button = ({ onClick, children }) =>
  <button onClick={onClick} type="button">
    {children}
  </button>

const Movies = ({list}) =>
  <div className="movies">
    { list.map(function(item) {
      if (item.backdrop_path) {
        return (
          <div key={item.id} className="movie-holder">
            <div className="movie">
              <span>{item.title}</span>

              <img src={'https://image.tmdb.org/t/p/w1280/' + item.backdrop_path} alt={item.title} />
            </div>
          </div>
        )
      }
    })}
  </div>

export default App;
