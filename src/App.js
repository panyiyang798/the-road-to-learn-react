import React, { Component } from "react";
import "./App.css";

const DEFAULT_QUERY = "redux";

const PATH_BASE = "http://hn.algolia.com/api/v1";
const PATH_SEARCH = "/search";
const PARAM_SEARCH = "query=";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      result: null,
      searchItem: DEFAULT_QUERY
    };
  }

  handleDelete = id => {
    const isNotId = item => item.objectID !== id;
    const updatedHits = this.state.result.hits.filter(isNotId);
    this.setState({ result: { ...this.state.result, hits: updatedHits } });
  };

  handleChange = e => {
    const text = e.target.value;
    const updatedHits = this.state.result.hits.filter(item =>
      item.title.toLowerCase().includes(this.state.searchItem.toLowerCase())
    );
    this.setState({
      searchItem: text,
      result: { ...this.state.result, hits: updatedHits }
    });
  };

  setSearchTopStories = result => {
    this.setState({ result });
  };

  fetchSearchTopStories(searchItem) {
    fetch(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchItem}`)
      .then(response => response.json())
      .then(result => this.setSearchTopStories(result))
      .catch(e => e);
  }

  componentDidMount() {
    const { searchItem } = this.state;
    this.fetchSearchTopStories(searchItem);
  }

  render() {
    const { searchItem, result } = this.state;
    return (
      <div className="page">
        <div className="interactions">
          <Search searchItem={searchItem} onSearchChange={this.handleChange}>
            Search
          </Search>
        </div>
        {result ? (
          <Table content={result.hits} onDelete={this.handleDelete} />
        ) : null}
      </div>
    );
  }
}

const Search = ({ onSearchChange, searchItem, children }) => {
  return (
    <form>
      {children}
      <input type="text" onChange={onSearchChange} value={searchItem} />
    </form>
  );
};

const Table = ({ content, onDelete }) => (
  <div className="table">
    {content.map(item => (
      <div key={item.objectID} className="table-row">
        <span style={largeColumn}>
          <a href={item.url}>{item.title}</a>
        </span>
        <span style={midColumn}>{item.author}</span>
        <span style={smallColumn}>{item.num_comments}</span>
        <span style={smallColumn}>{item.points}</span>
        <span style={smallColumn}>
          <Button
            onClick={() => onDelete(item.objectID)}
            type="button"
            className="button-inline"
          >
            Delete
          </Button>
        </span>
      </div>
    ))}
  </div>
);

const Button = ({ onClick, className, children }) => {
  return (
    <button type="button" onClick={onClick} className={className}>
      {children}
    </button>
  );
};

const largeColumn = {
  width: "40%"
};

const midColumn = {
  width: "30%"
};

const smallColumn = {
  width: "10%"
};

export default App;
