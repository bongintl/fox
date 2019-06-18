<?php

namespace Craft;

class ShopifyVariable
{
	public function getProducts($options = array())
	{
		return craft()->shopify->getProducts($options);
	}

	public function getProductById($options = array())
	{
		return craft()->shopify->getProductById($options);
	}
	
	public function getCollections($options = array())
	{
		return craft()->shopify->getCollections($options);
	}

	public function getCollectionById($options = array())
	{
		return craft()->shopify->getCollectionById($options);
	}
	
	public function getVariantById($options = array())
	{
		return craft()->shopify->getVariantById($options);
	}
	
	public function getBagItems( $query = '' )
	{
		return craft()->shopify->getBagItems($query);
	}
	
	public function sortProductsInCollection( $products, $collectionID )
	{
		return craft()->shopify->sortProductsInCollection($products, $collectionID);
	}
	
	public function getProductsInCollection( $collectionID )
	{
		return craft()->shopify->getProductsInCollection($collectionID);
	}
	
	public function getProductsVariants($options = array())
	{
		$products = craft()->shopify->getProducts($options);

		foreach ($products as $product) {
			$id = $product['id'];
			$variants = $product['variants'];
			$product_prices[$id]  = $variants;
		}

		return $product_prices;
	}
	
	public function getHostname()
	{
		return craft()->plugins->getPlugin('shopify')->getSettings()->hostname;
	}
	
	public function getProductMetafields($productID)
	{
		return craft()->shopify->getProductMetafields($productID);
	}
}