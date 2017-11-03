<template>
	<b-container>
		<b-jumbotron bg-variant="light">
			<template slot="header">
				Movie List	
			</template>

			<template slot="lead">
				List of in my Kodi DB
			</template>

			<hr>
				<div v-for="movie in movies">
						<router-link :to="{ name: 'show', params: {id:movie.idMovie}}">
						<img v-bind:src="movie.c08">
						</router-link>
						<hr>
				</div>
		</b-jumbotron>
	</b-container>
</template>

<script>
export default {
	created() {
	this.$http.get('/api/movies')
		.then( (response) => {
			this.movies = response.data;
			//console.dir(row.c08);
			});
	},
	data () {
		return {
			movies: []

		}
	}
}
</script>

<style>
</style>
