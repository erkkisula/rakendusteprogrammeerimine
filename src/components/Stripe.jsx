/* eslint-disable no-unused-vars */
import React from "react";
import { StripeProvider } from "react-stripe-elements";
import { Elements, CardElement, injectStripe} from "react-stripe-elements";
import { connect } from "react-redux";
import "../style/Stripe.css";
import PropTypes from "prop-types";
import * as services from "../services.js";
import * as selectors from "../store/selectors.js"
import * as actions from "../store/actions.js";

class Stripe extends React.PureComponent {
    static propTypes = {
        sum: PropTypes.number.isRequired,
        onSubmit: PropTypes.func.isRequired
    };

    render() {
        return (
            <StripeProvider apiKey="pk_test_gZBGBVA3xf9IfcBoDRuyZTCl00HCzcYqUh">
                <Elements>
                    <InjectStripeForm sum = {this.props.sum} onSubmit= {this.props.onSubmit}/>
                </Elements>
            </StripeProvider>
        )
    }
}

export default Stripe;

class StripeForm extends React.PureComponent {
    static propTypes = {
        stripe: PropTypes.object.isRequired,
        sum: PropTypes.number.isRequired,
        userId: PropTypes.string.isRequired,
        token: PropTypes.string.isRequired,
        dispatch: PropTypes.func.isRequired,
        onSubmit: PropTypes.func.isRequired
    }
    handleSubmit = (event) => {
        event.preventDefault();
        this.props.stripe.createToken().then( ({error, token}) => {
            console.log("result", error, token);
            if(error) {
                console.log("error", error);
                return;
            }
            services.checkout({stripeToken: token, userId: this.props.userId, token: this.props.token})
            .then(x => {
                console.log('checkout', x);
                this.props.dispatch(actions.refreshUser());
                this.props.onSubmit();
            })
            .catch(err => {
                console.error(err);
            })
        });
    }
    render() {
        return (
            <form className="stripe-form" onSubmit={this.handleSubmit}>
                <label>
                    Card details
                    <CardElement style={{ base: { fontSize: '18px' } }} />
                </label>
                <button className="stripe-pay">Pay {this.props.sum}€</button>
            </form>
        )
    }
}

const mapStateToProps = (store) => {
    return {
        userId: selectors.getUserId(store),
        token: selectors.getToken(store)
    }

}

const InjectStripeForm = connect(mapStateToProps)(injectStripe(StripeForm));