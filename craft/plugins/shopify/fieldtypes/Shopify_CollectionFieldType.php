<?php

namespace Craft;

class Shopify_CollectionFieldType extends BaseFieldType
{
	public function getName()
	{
		return Craft::t('Shopify Collection');
	}

	/**
	 * Get products from Shopify
	 *
	 * @return array Array of Shopify Products
	 */
	public function getInputHtml($name, $value)
	{
		$collectionOptions = array('limit' => 250);
		$collections = craft()->shopify->getCollections($collectionOptions);

		$options = array();
		foreach ($collections as $collection) {
			$options[] = array(
				'label' => $collection['title'],
				'value' => $collection['id']
			);
		}

		return craft()->templates->render('shopify/_select', array(
			'name' => $name,
			'value' => $value,
			'options' => $options
		));
	}
}