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
        <form className="form-inline" onSubmit={this.handleSubmit}
          onMouseLeave={() => {
            if (!this.state.searchInFocus) {
              this.setState({showAutoComplete: false});
            }
          }}>
          <div className="form-group">
            <div className="input-group">
              <div className="form-control field-shadow-wrapper">
                <input type="text" className="field-shadow field-shadow-bg"
                  readOnly={true}
                  value={this.state.selectedSuggestion}/>
                <input type="text" ref="search" className="field-shadow"
                  placeholder="Search term"
                  onChange={this.onFieldChange.bind(this)} value={this.state.term}

                  onBlur={() => {
                    this.setState({searchInFocus: false});
                  }}
                  onFocus={() => {
                    this.setState({showAutoComplete: true});
                    this.setState({searchInFocus: true});
                  }}
                  onKeyDown={(e) => {
                    switch (e.which) {
                      case 40:
                        AppActionCreator.downArrowSelect();
                        break;
                      case 38:
                        AppActionCreator.upArrowSelect();
                        break;
                      case 13:
                        this.handleSubmit();
                        break;
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
    if (!this.state.showAutoComplete) return;
    return (
      <ul className='auto-complete-list'>
        {this.state.suggestions.map((item, index) => {
          var selectedClassName = '';
          if (this.state.selectedIndex === index) {
            selectedClassName = 'selected';
          }
          return (<li key={item.identifier}
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
    var term = this.refs.search.getDOMNode().value;

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

  handleSubmit () {
    var area = this.state.selectedSuggestion;
    AppActionCreator.getListing(area);
    this.setState({showAutoComplete: false});
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
