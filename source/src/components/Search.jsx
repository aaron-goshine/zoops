import React from 'react';
import SearchStore from '../stores/SearchStore';
import AppActionCreator from '../actions/AppActionCreator';
import _ from 'lodash';

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
      <div className="search-form">
        <form className="form-inline">
          <div className="form-group">
            <div className="input-group">
              <div className="form-control field-shadow-wrapper">
                <input type="text" ref="search" className="field-shadow"
                  placeholder="Search term"
                  onChange={this.onFieldChange.bind(this)} value={this.getSelectedTerm()}

                  onBlur={() => {
                    this.setState({showAutoComplete: false});
                  }}
                  onFocus={() => {
                    this.setState({showAutoComplete: true});
                  }}
                  onKeyDown={(e) => {
                    switch (e.which) {
                      // key 37 is the left arrow
                      // key 40 is the down arrow
                      case 37:
                      case 40:
                        e.preventDefault();
                        this.setState({keySelected: true});
                        AppActionCreator.downArrowSelect();
                        break;
                      // key 38 is the up arrow
                      // key 39 is the right arrow
                      case 38:
                      case 39:
                        e.preventDefault();
                        this.setState({keySelected: true});
                        AppActionCreator.upArrowSelect();
                        break;
                      // key 13 is the enter key by default
                      case 13:
                        this.handleSubmit(e);
                        break;
                      default:
                        this.setState({keySelected: false});
                    }
                  }}
                  placeholder="Where do you want to live in UK?"/>
              </div>
              <div className="input-group-addon" onClick={this.handleSubmit}>Search</div>
            </div>
          </div>
          {this.renderAutoCompete()}
        </form>
      </div>
    );
  }

  renderAutoCompete () {
    if (this.state.suggestions.length < 1 || !this.state.showAutoComplete) return;
    return (
      <ul key="autocomplete" className="auto-complete-list">
        {this.state.suggestions.map((item, index) => {
          var selectedClassName = '';
          if (this.state.selectedIndex === index) {
            selectedClassName = 'selected';
          }

          return (<li key={index}
            className={selectedClassName}
            data-index={index}
            onClick={(event) => {
              AppActionCreator.selectByIndex(event.target.getAttribute('data-index'));
              this.handleSubmit();
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
