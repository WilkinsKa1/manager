import { compose, defaultTo, lensPath, pathOr, set } from 'ramda';
import * as React from 'react';
import ActionsPanel from 'src/components/ActionsPanel';
import Button from 'src/components/Button';
import {
  StyleRulesCallback,
  withStyles,
  WithStyles
} from 'src/components/core/styles';
import ExpansionPanel from 'src/components/ExpansionPanel';
import Grid from 'src/components/Grid';
import MenuItem from 'src/components/MenuItem';
import Notice from 'src/components/Notice';
import TextField from 'src/components/TextField';
import { withAccount } from 'src/features/Billing/context';
import { Requestable } from 'src/requestableContext';
import { updateAccountInfo } from 'src/services/account';
import composeState from 'src/utilities/composeState';
import getAPIErrorFor from 'src/utilities/getAPIErrorFor';
import scrollErrorIntoView from 'src/utilities/scrollErrorIntoView';

import * as countryRegionItems from 'src/features/Billing/BillingPanels/UpdateContactInformationPanel/countryRegionData.json';

type ClassNames = 'root' | 'mainFormContainer' | 'stateZip';

const styles: StyleRulesCallback<ClassNames> = theme => ({
  root: {},
  mainFormContainer: {
    maxWidth: 860
  },
  stateZip: {
    [theme.breakpoints.up('md')]: {
      maxWidth: `calc(415px + ${theme.spacing.unit * 2}px)`
    }
  }
});

interface State {
  submitting: boolean;
  submissionErrors?: Linode.ApiFieldError[];
  countryRegionItems?: any;
  success?: string;
  fields: {
    address_1?: string;
    address_2?: string;
    city?: string;
    company?: string;
    country?: string;
    email?: string;
    first_name?: string;
    last_name?: string;
    phone?: string;
    state?: string;
    tax_id?: string;
    zip?: string;
  };
}

type CombinedProps = Requestable<Linode.Account> & WithStyles<ClassNames>;

const field = (path: string[]) => lensPath(['fields', ...path]);

const L = {
  fields: {
    address_1: field(['address_1']),
    address_2: field(['address_2']),
    city: field(['city']),
    company: field(['company']),
    country: field(['country']),
    email: field(['email']),
    first_name: field(['first_name']),
    last_name: field(['last_name']),
    phone: field(['phone']),
    state: field(['state']),
    tax_id: field(['tax_id']),
    zip: field(['zip'])
  }
};

class UpdateContactInformationPanel extends React.Component<
  CombinedProps,
  State
> {
  state: State = {
    submitting: false,
    fields: {},
    countryRegionItems
  };

  composeState = composeState;

  render() {
    return (
      <ExpansionPanel
        heading="Update Contact Information"
        actions={this.renderFormActions}
      >
        {this.renderContent()}
      </ExpansionPanel>
    );
  }

  renderContent = () => {
    const { loading, errors, data, lastUpdated } = this.props;

    if (loading && lastUpdated === 0) {
      return this.renderLoading();
    }

    if (errors) {
      return this.renderErrors(errors);
    }

    return data ? this.renderForm(data) : this.renderEmpty();
  };

  renderLoading = () => null;

  renderErrors = (e: Linode.ApiFieldError[]) => null;

  renderForm = (account: Linode.Account) => {
    const { classes } = this.props;
    const {
      fields,
      submissionErrors,
      success,
      countryRegionItems
    } = this.state;

    const hasErrorFor = getAPIErrorFor(
      {
        address_1: 'address',
        address_2: 'address 2',
        city: 'city',
        company: 'company',
        country: 'country',
        email: 'email',
        first_name: 'first name',
        last_name: 'last name',
        phone: 'phone',
        state: 'state / province',
        tax_id: 'tax ID',
        zip: 'zip / postal code'
      },
      submissionErrors
    );

    const generalError = hasErrorFor('none');

    return (
      <Grid
        container
        className={classes.mainFormContainer}
        data-qa-update-contact
      >
        {generalError && (
          <Grid item xs={12}>
            <Notice error text={generalError} />
          </Grid>
        )}
        {success && (
          <Grid item xs={12}>
            <Notice success text={success} />
          </Grid>
        )}

        <Grid
          item
          xs={12}
          updateFor={[fields.company, hasErrorFor('company'), classes]}
        >
          <Grid container>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Company Name"
                value={defaultTo(account.company, fields.company)}
                errorText={hasErrorFor('company')}
                onChange={this.updateCompany}
                data-qa-company
              />
            </Grid>
          </Grid>
        </Grid>

        <Grid
          item
          xs={12}
          sm={6}
          updateFor={[fields.email, hasErrorFor('email'), classes]}
        >
          <TextField
            label="Email"
            type="email"
            value={defaultTo(account.email, fields.email)}
            errorText={hasErrorFor('email')}
            onChange={this.updateEmail}
            data-qa-contact-email
          />
        </Grid>

        <Grid
          item
          xs={12}
          sm={6}
          updateFor={[fields.phone, hasErrorFor('phone'), classes]}
        >
          <TextField
            label="Phone Number"
            type="tel"
            value={defaultTo(account.phone, fields.phone)}
            errorText={hasErrorFor('phone')}
            onChange={this.updatePhone}
            data-qa-contact-phone
          />
        </Grid>

        <Grid
          item
          xs={12}
          sm={6}
          updateFor={[fields.first_name, hasErrorFor('first_name'), classes]}
        >
          <TextField
            label="First Name"
            value={defaultTo(account.first_name, fields.first_name)}
            errorText={hasErrorFor('first_name')}
            onChange={this.updateFirstName}
            data-qa-contact-first-name
          />
        </Grid>

        <Grid
          item
          xs={12}
          sm={6}
          updateFor={[fields.last_name, hasErrorFor('last_name'), classes]}
        >
          <TextField
            label="Last Name"
            value={defaultTo(account.last_name, fields.last_name)}
            errorText={hasErrorFor('last_name')}
            onChange={this.updateLastName}
            data-qa-contact-last-name
          />
        </Grid>

        <Grid
          item
          xs={12}
          sm={6}
          updateFor={[fields.address_1, hasErrorFor('address_1'), classes]}
        >
          <TextField
            label="Address"
            value={defaultTo(account.address_1, fields.address_1)}
            errorText={hasErrorFor('address_1')}
            onChange={this.updateAddress1}
            data-qa-contact-address-1
          />
        </Grid>

        <Grid
          item
          xs={12}
          sm={6}
          updateFor={[fields.address_2, hasErrorFor('address2'), classes]}
        >
          <TextField
            label="Address 2"
            value={defaultTo(account.address_2, fields.address_2)}
            errorText={hasErrorFor('address_2')}
            onChange={this.updateAddress2}
            data-qa-contact-address-2
          />
        </Grid>

        <Grid
          item
          xs={12}
          sm={6}
          updateFor={[fields.city, hasErrorFor('city'), classes]}
        >
          <TextField
            label="City"
            value={defaultTo(account.city, fields.city)}
            errorText={hasErrorFor('city')}
            onChange={this.updateCity}
            data-qa-contact-city
          />
        </Grid>

        <Grid
          item
          xs={12}
          sm={6}
          updateFor={[
            fields.state,
            fields.zip,
            hasErrorFor('state'),
            hasErrorFor('zip'),
            classes
          ]}
        >
          <Grid container className={classes.stateZip}>
            <Grid item xs={12} sm={7}>
              <TextField
                label="State / Province"
                value={'defaultTo(account.state, fields.state)'}
                errorText={hasErrorFor('state')}
                onChange={this.updateState}
                select
                data-qa-contact-province
              >
                {countryRegionItems.default.map((country: any) => {
                  if (country.countryShortCode === fields.country) {
                    // return console.log(country, country.regions);
                    country.regions.map((region: any) => {
                      return (
                        <MenuItem
                          value={region.shortCode}
                          key={region.shortCode}
                        >
                          {region.name}
                        </MenuItem>
                      );
                    });
                  }
                })}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={5}>
              <TextField
                label="Zip / Postal Code"
                value={defaultTo(account.zip, fields.zip)}
                errorText={hasErrorFor('zip')}
                onChange={this.updateZip}
                data-qa-contact-post-code
              />
            </Grid>
          </Grid>
        </Grid>

        <Grid
          item
          xs={12}
          sm={6}
          updateFor={[fields.country, hasErrorFor('country'), classes]}
        >
          <TextField
            label="Country"
            value={defaultTo(account.country, fields.country)}
            errorText={hasErrorFor('country')}
            onChange={this.updateCountry}
            select
            data-qa-contact-country
          >
            {countryRegionItems.default.map((country: any) => {
              return (
                <MenuItem
                  value={country.countryShortCode}
                  key={country.countryShortCode}
                >
                  {country.countryName}
                </MenuItem>
              );
            })}
          </TextField>
        </Grid>

        <Grid
          item
          xs={12}
          sm={6}
          updateFor={[fields.tax_id, hasErrorFor('tax_id'), classes]}
        >
          <TextField
            label="Tax ID"
            value={defaultTo(account.tax_id, fields.tax_id)}
            errorText={hasErrorFor('tax_id')}
            onChange={this.updateTaxID}
            data-qa-contact-tax-id
          />
        </Grid>
      </Grid>
    );
  };

  renderFormActions = () => {
    const { loading, lastUpdated, errors } = this.props;

    if ((loading && lastUpdated === 0) || errors) {
      return null;
    }

    return (
      <ActionsPanel>
        <Button
          type="primary"
          onClick={this.submitForm}
          loading={this.state.submitting}
          data-qa-save-contact-info
        >
          Save
        </Button>
        <Button
          type="secondary"
          onClick={this.resetForm}
          data-qa-reset-contact-info
        >
          Reset
        </Button>
      </ActionsPanel>
    );
  };

  renderEmpty = () => null;

  updateAddress1 = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.composeState([set(L.fields.address_1, e.target.value)]);
  };

  updateAddress2 = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.composeState([set(L.fields.address_2, e.target.value)]);
  };

  updateCity = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.composeState([set(L.fields.city, e.target.value)]);
  };

  updateCompany = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.composeState([set(L.fields.company, e.target.value)]);
  };

  updateCountry = (e: React.ChangeEvent<HTMLSelectElement>) => {
    this.composeState([set(L.fields.country, e.target.value)]);
  };

  updateEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.composeState([set(L.fields.email, e.target.value)]);
  };

  updateFirstName = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.composeState([set(L.fields.first_name, e.target.value)]);
  };

  updateLastName = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.composeState([set(L.fields.last_name, e.target.value)]);
  };

  updatePhone = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.composeState([set(L.fields.phone, e.target.value)]);
  };

  updateState = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.composeState([set(L.fields.state, e.target.value)]);
  };

  updateTaxID = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.composeState([set(L.fields.tax_id, e.target.value)]);
  };

  updateZip = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.composeState([set(L.fields.zip, e.target.value)]);
  };

  submitForm = () => {
    this.setState({
      submissionErrors: undefined,
      success: undefined,
      submitting: true
    });

    updateAccountInfo(this.state.fields)
      .then(updatedAccount => {
        this.props.update(existingAccount => {
          /* API returns:
           * credit_card: {"expiry": null, "last_four": null}
           * rather than credit_card = null. The merge will therefore
           * overwrite the previous values for expiration/last 4 digits
           * with null, so we need to manually set them here.
           */
          return {
            ...existingAccount,
            ...updatedAccount,
            credit_card: existingAccount.credit_card
          };
        });

        this.setState({
          success: 'Contact information successfully updated.',
          submitting: false
        });
      })
      .catch(response => {
        const fallbackError = [
          {
            reason: 'Unable to save your contact information. Please try again.'
          }
        ];
        this.setState(
          {
            submitting: false,
            submissionErrors: pathOr(
              fallbackError,
              ['response', 'data', 'errors'],
              response
            )
          },
          () => {
            scrollErrorIntoView();
          }
        );
      });
  };

  resetForm = () =>
    this.setState({
      fields: {},
      submissionErrors: undefined,
      submitting: false,
      success: undefined
    });
}

const styled = withStyles(styles);

const accountContext = withAccount();

const enhanced = compose(
  styled,
  accountContext
);

export default enhanced(
  UpdateContactInformationPanel
) as React.ComponentType<{}>;
