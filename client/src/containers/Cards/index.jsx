import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core';

import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import CircularProgress from '@material-ui/core/CircularProgress';

import CardItem from '@/components/CardItem';
import withTitle from '@/components/withTitle';

import { getCards, deleteCard } from './actions';
import styles from './styles';
import Axios from 'axios';

class Cards extends Component {
	componentDidMount() {
		this.props.getCards();

		this.handleEdit = this.handleEdit.bind(this);
		this.handleETC = this.handleETC.bind(this);
	}

	handleEdit = id => e => {
		e.preventDefault();

		this.props.history.push(`/edit-card/${id}`);
	};

	handleDelete = id => e => {
		e.preventDefault();

		console.log(id);

		if (window.confirm('Deseja apagar este card?')) {
			this.props.deleteCard(id);
		}
	};

	handleETC = e => {
		e.preventDefault();

		Axios.get('http://localhost:9000/api/cards')
			.then(result => console.log(result))
			.catch(err => console.error(err));
	};

	render() {
		const { cards, error, loading, classes } = this.props;

		return (
			<Container>
				<Typography component="h4" variant="h2" align="center" className="mt-3 mb-3">
					Cards
				</Typography>
				<Button onClick={this.handleETC}>LOAD TEST</Button>

				<Divider />
				{/* Caso esteja carregando (procurando cards no banco de dados) */}
				{loading === true ? (
					<Grid container direction="row" justify="center" className="mt-3">
						<CircularProgress className={classes.spinner} />
					</Grid>
				) : error === true ? (
					// Caso exista um erro
					<div>
						<Typography component="h5" variant="h4" align="center" className="mt-3 mb-3">
							Erro ao tentar recuperar os cards do banco de dados
						</Typography>

						<Grid container direction="row" justify="center">
							<Button variant="contained" onClick={e => this.props.getCards()}>
								Tentar Novamente
							</Button>
						</Grid>
					</div>
				) : (
					// Caso tudo dê certo
					<Grid container spacing={4} className="mt-3 mb-3">
						{cards.map(item => (
							<Grid item xs={12} sm={6} md={4} lg={4} xl={4} key={item._id}>
								<CardItem
									data={item}
									user={item.user}
									handleEdit={this.handleEdit}
									handleDelete={this.handleDelete}
								/>
							</Grid>
						))}
					</Grid>
				)}
			</Container>
		);
	}
}

const mapStateToProps = state => {
	const { cards, error, loading } = state.Cards;

	return {
		cards,
		error,
		loading,
	};
};

const mapDispatchToProps = {
	getCards,
	deleteCard,
};

export default connect(
	mapStateToProps,
	mapDispatchToProps,
)(withStyles(styles)(withTitle({ component: Cards, title: 'Cards' })));
