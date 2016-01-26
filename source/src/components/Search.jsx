import React from 'react';
import SearchStore from '../stores/SearchStore';
import AppActionCreator from '../actions/AppActionCreator';

class ListComponent extends React.Component {
  constructor (props) {
    super(props);
    this.state = this.getStateFromStore();
  }

  componentWillMount () {
    SearchStore.addChangeListener(this.onChange.bind(this));
  }

  componentWillUnMount () {
    SearchStore.removeChangeListener(this.onChange.bind(this));
  }

  render () {
    return (
      <form className="search-form form-inline pull-right">
        <div className="input-group">
          <input ref="search"
            type="text"
            className="form-control"
            onChange={this.onFieldChange.bind(this)}
            value={this.getSelectedTerm()}
            onBlur={this.onBlur.bind(this)}
            onFocus={this.onFocus.bind(this)}
            onKeyDown={this.onKeyDown.bind(this)}
            placeholder="Enter a uk location"
            />
            <div className="input-group-addon"
              onClick={this.handleSubmit.bind(this)}>Search</div>
          </div>
          {this.renderAutoCompete()}
        </form>
    );
  }

  onBlur () {
    window.clearTimeout(window.timeoutHandle);
    window.timeoutHandle = setTimeout(() => {
      this.setState({showAutoComplete: false});
    }, 3000);
  }

  onFocus () {
    window.clearTimeout(window.timeoutHandle);
    this.setState({showAutoComplete: true});
  }

  onKeyDown (event) {
    switch (event.which) {
      // key 37 is the left arrow
      // key 40 is the down arrow
      case 37:
      case 40:
        event.preventDefault();
        this.setState({keySelected: true});
        AppActionCreator.downArrowSelect();
        break;
        // key 38 is the up arrow
        // key 39 is the right arrow
      case 38:
      case 39:
        event.preventDefault();
        this.setState({keySelected: true});
        AppActionCreator.upArrowSelect();
        break;
        // key 13 is the enter key by default
      case 13:
        this.handleSubmit(event);
        break;
      default:
        this.setState({keySelected: false});
    }
  }
  renderAutoCompete () {
    if (this.state.suggestions.length < 1 || !this.state.showAutoComplete) return;
    return (
      <ul key="autocomplete" className="list-group auto-complete-list">
        {this.state.suggestions.map((item, index) => {
          var activeClass = '';
          if (this.state.selectedIndex === index) {
            activeClass = ' list-group-item-info ';
          }

          return (<li key={index}
            className={'list-group-item' + activeClass}
            data-index={index}
            onClick={(event) => {
              AppActionCreator.selectByIndex(index);
              this.handleSubmit(event);
            }}>{item.value}</li>);
        })}
      </ul>
    );
  }

  onFieldChange () {
    var term = this.refs.search.value;

    if (!term && term.length > 3) {
      this.setState({'term': term});
      AppActionCreator.cleanAutoComplete();
      return;
    }
    this.setState({'term': term});
    AppActionCreator.getAutoComplete(term);
  }

  onChange () {
    this.setState(this.getStateFromStore());
  }

  handleSubmit (event) {
    event.preventDefault();
    var area = this.state.selectedSuggestion;
    AppActionCreator.getListing(area);
    this.setState({showAutoComplete: false});
  }
  getSelectedTerm () {
    var term = '';
    if (this.state.keySelected) {
      return this.state.selectedSuggestion;
    }
    return this.state.term;
  }
  getStateFromStore () {
    return {
      suggestions: SearchStore.getSuggestions(),
      selectedIndex: SearchStore.getSelectedIndex(),
      selectedSuggestion: SearchStore.getSelectedSuggestions()
    };
  }
}

export default ListComponent;
