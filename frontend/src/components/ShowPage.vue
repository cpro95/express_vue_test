<template>
	<div>
		<b-card>
			<h2 slot="header">{{movie.c00}}</h2>
			<b-card-img
				v-bind:src="movie.c20"
			></b-card-img>

			<h5>{{movie.c03}}</h5>

			<p class="card-text">
				{{movie.c01}}
			</p>

			<h6 slot="footer"><b-badge>[{{movie.c07}}]</b-badge>/ <b-badge>{{movie.c05 | formatNumber}}</b-badge></h6>
		</b-card>
	</div>
</template>

<script>
export default {
	created: function() {
		var id = this.$route.params.id;
		this.$http.get(`/api/movies/${id}`)
			.then( (response) => {
				this.movie = response.data[0];
			});
	},
	filters: {
		formatNumber(val) {
			return parseFloat(Math.round(val * 100) / 100).toFixed(2);
		}
	},
	data: function() {
		return {
			movie: {}
		}
	}
}
</script>

<style lang="css">
</style>