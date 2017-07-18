# Point Blue Material Design Slider

Documentation for the original slider: [https://material.angularjs.org/HEAD/api/directive/mdSlider](https://material.angularjs.org/HEAD/api/directive/mdSlider)

This slider has been modified in the following ways:

  - Slider can use arbitrary steps
  
## Using arbitrary step values  

The original slider takes a min and max value, and allows you to define steps. For example,
you can set a minimum value of 0, a max of 20, and set the step value to 10, allowing the
values 0, 10, and 20.  

The Point Blue modification adds an attribute `steps` which takes an array of integers. Each integer is a tick on the 
slider, and a value that can be selected.

```
<pb-md-slider ng-model="mySliderModel" md-discrete step="50" min="0" max="500" steps="[0,14,18,23,55,100]"></pb-md-slider>
```