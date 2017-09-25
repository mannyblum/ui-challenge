import React, { Component } from 'react';
import './App.css';

const TMDB = {
  'pathBase': 'https://api.themoviedb.org/3',
  'endpoint': '/movie/popular',
  'apiKey': '676b37a6ad0aaaa61a566c3097c60afe'
};

class App extends Component {
  constructor(props) {
    super(props);

    // defaults
    this.state = {
      results: [],
      page: 1,
      initLoad: false,
      isLoadingMore: false
    };

    // binds
    this.fetchMovies = this.fetchMovies.bind(this);

    this.loadMore = this.loadMore.bind(this);
    this.onScroll = this.onScroll.bind(this);
  }

  // simpler fetch function that only fetches data and sets new state
  fetchMovies(pageToLoad) {
    if (!pageToLoad) {
      this.setState({ initLoad: true });
    }

    let page = pageToLoad || this.state.page;
    const path = `${TMDB.pathBase}${TMDB.endpoint}?api_key=${TMDB.apiKey}&page=${page}`;

    fetch(path)
      .then(response => response.json())
      .then(result => {
        let newState = this.state.results.concat(result.results);
        this.setState({ results: newState, initLoad: false, isLoadingMore: false, page: page });
      });
  }

  // fetch movies when component mounts, also loadMore if there isn't enough to
  // fill the page
  // add event listener for scroll
  componentDidMount() {
    this.fetchMovies();

    if (document.body.offsetHeight < window.innerHeight) {
      this.loadMore();
    }

    window.addEventListener('scroll', this.onScroll, false);
  }

  onScroll()  {
    if ((window.innerHeight + window.scrollY) >= (document.body.offsetHeight - 500) && !this.state.isLoadingMore ) {
      this.loadMore();
    }
  }

  loadMore() {
    let page = this.state.page + 1;

    this.setState({page: page, isLoadingMore: true});

    this.fetchMovies(page);
  }

  render() {
    const { results, initLoad} = this.state;

    return (
      <div className="flix">
        <div className="flix-header">
          <h1>Popular</h1>
        </div>
        {(initLoad|| !results) ?
          <Loading /> :
          <Movies list={results} />
        }
      </div>
    );
  }
}

// Since we don't have state or refs, use stateless component
function Loading() {
  return (
    <div className="movies">
      <h1>Loading ...</h1>
    </div>
  );
}

// Since we don't have state or refs, use stateless component
function Movies({list}) {
  return (
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
        );
      })}
    </div>
  );
}

export default App;
