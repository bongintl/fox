<?php

namespace Craft;

use Twig_Extension;
use Twig_Filter_Method;
use Twig_Function_Method;

function tag_regex( $tag ) {
    return "/<$tag.*?>.*?<\/$tag>/s";
}

function is_self_closing ( $tag ) {
    $selfClosingTags = [ 'area', 'base', 'br', 'col', 'command', 'embed', 'hr', 'img', 'input', 'keygen', 'link', 'menuitem', 'meta', 'param', 'source', 'track', 'wbr' ];
    return in_array( $tag, $selfClosingTags );
}

class BongTwigExtension extends \Twig_Extension
{

    public function getName()
    {
        return 'BONG Twig Extension';
    }

    public function getFilters()
    {
        return [
            'italicise_lowercase' => new \Twig_Filter_Method( $this, 'italicise_lowercase' ),
            'italicise_numbers' => new \Twig_Filter_Method( $this, 'italicise_numbers' ),
            'delete_tag' => new \Twig_Filter_Method( $this, 'delete_tag' ),
            'extract_tag' => new \Twig_Filter_Method( $this, 'extract_tag' ),
            'index_by' => new \Twig_Filter_Method( $this, 'index_by' ),
            'filter_by' => new \Twig_Filter_Method( $this, 'filter_by' ),
            'pluck' => new \Twig_Filter_Method( $this, 'pluck' )
        ];
    }
    
    public function getFunctions ()
    {
        return [
            'attrs' => new \Twig_Function_Method( $this, 'attrs' ),
            'style' => new \Twig_Function_Method( $this, 'style' ),
            'element' => new \Twig_Function_Method( $this, 'element' ),
            'bem' => new \Twig_Function_Method( $this, 'bem' ),
            'srcset' => new \Twig_Function_Method( $this, 'srcset' ),
            'sizes' => new \Twig_Function_Method( $this, 'sizes' ),
            'img' => new \Twig_Function_Method( $this, 'img' )
        ];
    }
    
    public function italicise_lowercase( $content )
    {
        return str_replace(
            '<em></em>',
            '',
            "<em>" . preg_replace( '/(\b[A-Z]+\b)/', '</em>$0<em>', $content ) . "</em>"
        );
    }
    
    public function italicise_numbers( $content )
    {
        return preg_replace( '/(\b[0-9]+\b)/', '<em>$0</em>', $content );
    }
    
    public function delete_tag( $content, $tag )
    {
        return preg_replace( tag_regex( $tag ), '', $content );
    }
    
    public function extract_tag( $content, $tag )
    {
        preg_match_all( tag_regex( $tag ), $content, $matches );
        return $matches[ 0 ];
    }
    
    public function index_by( $arr, $key )
    {
        $res = [];
        foreach ( $arr as $item ) {
            $res[ $item[ $key ] ] = $item;
        }
        return $res;
    }
    
    public function filter_by ( $arr, $key, $value = null ) {
        $res = [];
        if ( $value != null ) {
            foreach ( $arr as $item ) {
                if ( $item[ $key ] == $value ) $res []= $item;
            }
        } else {
            foreach ( $arr as $item ) {
                if ( $item[ $key ] ) $res []= $item;
            }
        }
        return $res;
    }
    
    public function pluck ( $arr, $key ) {
        $res = [];
        foreach ( $arr as $item ) {
            $res []= $item[ $key ];
        }
        return $res;
    }
    
    public function attrs ( $dict ) {
        $attrs = [];
        foreach ( $dict as $key => $value ) {
            if ( $key == 'style' && is_array( $value ) ) $value = $this -> style( $value );
            $attrs []= "$key=\"$value\"";
        }
        return TemplateHelper::getRaw( implode( ' ', $attrs ) );
    }
    
    public function style ( $dict ) {
        $style = [];
        foreach ( $dict as $key => $value ) {
            $attrs []= "$key: $value";
        }
        return TemplateHelper::getRaw( implode( '; ', $style ) );
    }
    
    public function bem ( $be, $ms = [] ) {
        $classes = [ $be ];
        foreach ( $ms as $key => $value ) {
            if ( $value ) {
                $classes []= "$be--$key";
            }
        }
        return TemplateHelper::getRaw( implode( ' ', $classes ) );
    }
    
    public function transforms ( $asset ) {
        if ( !is_string( $asset ) && $asset -> getExtension() == 'svg' ) {
            return [[
                'width' => $asset -> width,
                'height' => $asset -> height,
                'url' => $asset -> url,
            ]];
        }
        $transforms = craft() -> assetTransforms -> allTransforms;
    	$sortByWidth = function ( $transformA, $transformB ) {
            return $transformA -> width > $transformB -> width ? 1 : -1;
        };
        usort( $transforms, $sortByWidth );
        $srcs = [];
    	foreach ( $transforms as $transform ) {
    	    $img = craft() -> imager -> transformImage( $asset, [
    	        'width' => $transform -> width,
    	        'quality' => $transform -> quality,
    	        'format' => $transform -> format
    	    ], null, null );
    		$srcs[] = [
    		    'width' => $img -> width,
    		    'height' => $img -> height,
    			'url' => $img -> url
    		];
    	}
    	return $srcs;
    }
    
    public function srcset ( $asset ) {
        $srcset = [];
        foreach ( $this -> transforms( $asset ) as $transform ) {
            $srcset []= $transform['url'] . ' ' . $transform['width'] . 'w';
        }
        return TemplateHelper::getRaw( implode( ', ', $srcset ) );
    }
    
    public function sizes ( $widths ) {
        $breakpoints = craft() -> config -> get('breakpoints', 'bongtwigextensions');
        $num = min( count( $breakpoints ), count( $widths ) );
        $sizes = [];
        for ( $i = 0; $i < $num; $i++ ) {
            $breakpoint = $breakpoints[ $i ];
            $width = $widths[ $i ];
            $vw = $width * 100;
            $sizes []= "( min-width: ${breakpoint}px ) ${vw}vw";
        }
        return TemplateHelper::getRaw( implode( $sizes, ', ' ) );
    }
    
    public function element ( $tag, $attrs, $content = '' ) {
        $attrs = $this -> attrs( $attrs );
        $html = is_self_closing( $tag )
            ? "<$tag $attrs/>"
            : "<$tag $attrs>$content</$tag>";
        return TemplateHelper::getRaw( $html );
    }
    
    public function img ( $asset, $sizes = [ 1 ], $attrs = [] ) {
        if ( is_string( $asset ) ) {
            $src = craft() -> imager -> transformImage( $asset, [
                'width' => craft() -> assetTransforms -> getTransformByHandle('xlarge') -> width
            ], null, null );
        } else {
            $src = $asset -> getUrl( 'xlarge' );
        }
        $attrs = array_merge( [
            'src' => $src,
            'srcset' => $this -> srcset( $asset )
        ], $attrs );
        if ( $sizes != null ) $attrs[ 'sizes' ] = $this -> sizes( $sizes );
        return TemplateHelper::getRaw( $this -> element( 'img', $attrs ) );
    }
    
}