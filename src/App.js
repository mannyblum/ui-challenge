import React, { Component } from 'react';
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
      isLoading: false,
      isLoadingMore: false
    };

    this.setPopularMovies = this.setPopularMovies.bind(this);
    this.fetchPopularMovies = this.fetchPopularMovies.bind(this);

    this.loadMore = this.loadMore.bind(this);
    this.onScroll = this.onScroll.bind(this);
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

  componentDidMount() {
    this.fetchPopularMovies(1, false);
    window.addEventListener('scroll', this.onScroll, false);
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.onScroll, false);
  }

  onScroll = () => {
    if ( (window.innerHeight + window.scrollY) >= (document.body.offsetHeight - 500) && this.state.results.length && !this.state.isLoadingMore ) {
      this.loadMore();
    }
  }

  loadMore() {
    this.setState({page: this.state.page + 1, isLoadingMore: true});

    // TODO: DRY THIS UP
    fetch(`${PATH_BASE}${PATH_SEARCH}?api_key=${API_KEY}&page=${this.state.page + 1}`)
      .then(response => response.json())
      .then(result => {
        this.setState({ results: this.state.results.concat(result.results), isLoadingMore: false })
      });
  }

  render() {
    const { results, isLoading } = this.state;

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
