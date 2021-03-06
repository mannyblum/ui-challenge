import React, { Component } from 'react';
import './App.css';

const PATH_BASE = 'https://api.themoviedb.org/3';
const PATH_SEARCH = '/movie/popular';
const API_KEY = '676b37a6ad0aaaa61a566c3097c60afe'; // this would be hidden in a normal application

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      results: null,
      page: 1,
      isLoading: false,
      isLoadingMore: false
    };

    this.fetchPopularMovies = this.fetchPopularMovies.bind(this);

    this.loadMore = this.loadMore.bind(this);
    this.onScroll = this.onScroll.bind(this);
  }

  fetchPopularMovies(page) {
    this.setState({ isLoading: true });

    // Initial Load of data
    fetch(`${PATH_BASE}${PATH_SEARCH}?api_key=${API_KEY}&page=${page}`)
      .then(response => response.json())
      .then(result => {
        this.setState({ results: result.results, isLoading: false });
      })
      .then(() => {
        // sorta hacky, loads 2 pages worth of data because I can't scroll wit h just 1 set of results and API doesn't allow to set a limit of results
        fetch(`${PATH_BASE}${PATH_SEARCH}?api_key=${API_KEY}&page=2`)
        .then(response => response.json())
        .then(result => {
          this.setState({ results: this.state.results.concat(result.results), isLoadingMore: false })
        })
      })
  ;
  }

  componentDidMount() {
    this.fetchPopularMovies(1);
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

    // TODO: DRY THIS UP - reuse `fetchPopularMovies`
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
      </div>
    );
  }
}

const Loading = () =>
  <div className="movies">
    <h1>Loading ...</h1>
  </div>

const Movies = ({list}) =>
  <div className="movies">
    { list.map(function(item) {
      if (!item.backdrop_path) {
        return false;
      }

      return (
        <div key={item.id} className="movie-holder">
          <div className="movie">
            <span>{item.title}</span>
            <img src={'https://image.tmdb.org/t/p/w1280/' + item.backdrop_path} alt={item.title} />
          </div>
        </div>
      )
    })}
  </div>

export default App;
