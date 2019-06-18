<?php

namespace Craft;

class ShopifyService extends BaseApplicationComponent
{
	protected $apiKey;
	protected $password;
	protected $secret;
	protected $hostname;

	/**
	 * Constructor
	 */
	public function __construct()
	{
		$settings = craft()->plugins->getPlugin('shopify')->getSettings();

		$this->apiKey = $settings->apiKey;
		$this->password = $settings->password;
		$this->secret = $settings->secret;
		$this->hostname = $settings->hostname;
	}

	/**
	 * Get products from Shopify
	 *
	 * @return array Array of Shopify Products
	 */
	public function getProducts($options = array())
	{
		$query = http_build_query($options);
		$url = $this->_getShopifyUrl('admin/products.json?' . $query);

		try {
			$client = new \Guzzle\Http\Client();
			$request = $client->get($url);
			$response = $request->send();

			if (!$response->isSuccessful()) {
				return;
			}

			$items = $response->json();

			return $items['products'];
		} catch(\Exception $e) {
			return [];
		}
	}

	/**
	 * Get specific product from Shopify
	 *
	 * @param array $options Array of options: id, fields
	 * @return array Shopify Product
	 */
	public function getProductById($options = array())
	{
		$id = $options['id'];
		$fields = isset($options['fields']) ? '?fields=' . $options['fields'] : '';
		$url = $this->_getShopifyUrl('admin/products/' . $id . '.json' . $fields);

		try {
			$client = new \Guzzle\Http\Client();
			$request = $client->get($url);
			$response = $request->send();

			if (!$response->isSuccessful()) {
				return;
			}

			$items = $response->json();

			return $items['product'];
		} catch(\Exception $e) {
			return;
		}
	}
	
	public function getVariantById($options = array())
	{

		$id = $options['id'];
		$fields = isset($options['fields']) ? '?fields=' . $options['fields'] : '';
		$url = $this->_getShopifyUrl('admin/variants/' . $id . '.json' . $fields);
		try {
			$client = new \Guzzle\Http\Client();
			$request = $client->get($url);
			$response = $request->send();

			if (!$response->isSuccessful()) {
				return;
			}

			$items = $response->json();

			return $items['variant'];
		} catch(\Exception $e) {
			return;
		}
	}
	
	public function getCollections($options = array())
	{
		$query = http_build_query($options);
		$url = $this->_getShopifyUrl('admin/custom_collections.json?' . $query);

		try {
			$client = new \Guzzle\Http\Client();
			$request = $client->get($url);
			$response = $request->send();

			if (!$response->isSuccessful()) {
				return 'not succesful';
			}
			
			$items = $response->json();

			return $items['custom_collections'];
		} catch(\Exception $e) {
			return $e;
		}
	}
	
	public function getCollectionById($options = array())
	{
		$id = $options['id'];
		$fields = isset($options['fields']) ? '?fields=' . $options['fields'] : '';
		$url = $this->_getShopifyUrl('admin/custom_collections/' . $id . '.json' . $fields);

		try {
			$client = new \Guzzle\Http\Client();
			$request = $client->get($url);
			$response = $request->send();

			if (!$response->isSuccessful()) {
				return;
			}

			$items = $response->json();

			return $items['custom_collection'];
		} catch(\Exception $e) {
			return;
		}
	}
	
	public function getBagItems ( $query )
	{
		$idPairs = [];
		foreach ( explode( ',', $query ) as $item ) {
			$idPairs []= explode( ':', $item );
		}
		$productIds = [];
		foreach ( $idPairs as $pair ) {
			$productId = $pair[ 0 ];
			if ( !in_array( $productId, $productIds ) ) {
				$productIds []= $productId;
			}
		}
		$products = $this -> getProducts([ 'ids' => implode( ',', $productIds ) ]);
		$productsById = [];
		foreach ( $products as $product ) $productsById[ $product[ 'id' ] ] = $product;
		$res = [];
		foreach ( $idPairs as $idPair ) {
			$productId = $idPair[ 0 ];
			$variantId = $idPair[ 1 ];
			$product = $productsById[ $productId ];
			foreach ( $product[ 'variants' ] as $variant ) {
				if ( $variant[ 'id' ] == $variantId ) {
					$res[ "$productId:$variantId" ] = [
						"id" => $variantId,
						"product_id" => $productId,
						"title" => $product[ 'title' ],
						"size" => $variant[ 'title' ],
						"price" => $variant[ 'price' ],
						"image" => $product[ 'image' ][ 'src' ]
					];
					break;
				}
			}
		}
		return $res;
	}
	
	public function sortProductsInCollection( $products, $collection ) {
		$cacheKey = "collection-order:{$collection['id']}:{$collection['updated_at']}";
		$cache = craft()->cache->get($cacheKey);
		if ( $cache == false ) {
			$positions = [];
			foreach ( $products as $product ) {
				$url = $this->_getShopifyUrl("admin/collects.json?product_id={$product['id']}&collection_id={$collection['id']}");
				try {
					$client = new \Guzzle\Http\Client();
					$request = $client->get($url);
					$response = $request->send();
					if (!$response->isSuccessful()) {
						return;
					}
					$items = $response->json();
					$collect = $items['collects'][ 0 ];
					$positions[ $product['id'] ] = $collect['position'];
				} catch(\Exception $e) {
					continue;
				}
			}
			$cache = json_encode( $positions );
			craft()->cache->set( $cacheKey, $cache, 60 * 60 * 24 );
		} else {
			$positions = json_decode( $cache, true );
		}
		usort( $products, function ( $a, $b ) use ( $positions ) {
			$pa = $positions[ $a['id'] ];
			$pb = $positions[ $b['id'] ];
			return $pa > $pb ? 1 : -1;
		});
		return $products;
	}
	
	public function getProductsInCollection( $collection ) {
		$products = $this -> getProducts([ 'collection_id' => $collection['id'] ]);
		return $this -> sortProductsInCollection( $products, $collection );
	}
	
	public function getProductMetafields ( $productID ) {
		$url = $this->_getShopifyUrl("admin/products/$productID/metafields.json");
		try {
			$client = new \Guzzle\Http\Client();
			$request = $client->get($url);
			$response = $request->send();

			if (!$response->isSuccessful()) {
				return;
			}

			$items = $response->json();
			
			return $items['metafields'];
		} catch(\Exception $e) {
			return;
		}
	}

	/**
	 * Get specific product from Shopify
	 *
	 * @param string $endpoint API endpoint
	 * @return string Full URL to make Shopify Request
	 */
	private function _getShopifyUrl($endpoint)
	{
		return 'https://' . $this->apiKey . ':' . $this->password . '@' . $this->hostname . '/' . $endpoint;
	}
}