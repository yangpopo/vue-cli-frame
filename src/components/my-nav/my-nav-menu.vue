<template>
		<li class="option">
			<slot></slot>
		</li>
	</ul>
</template>

<script>
	export default {
		name: 'my-nav-menu',
		props: {
			menuName: String
		},
		data() {
			return {

			}
		}
	}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
	ul.my-nav-menu {
		margin: 0px 0px 0px 20px;
		li {
			display: inline-block;
			min-width: 60px;
			padding: 0px 10px;
			text-align: center;
			a {
				font-size: 14px;
				color: #808492;
				text-decoration: none;
				&:hover {
					font-weight: bold;
					color: #fff;
				}
			}
		}
	}
</style>