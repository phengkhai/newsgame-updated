import React, { Component } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import emma from "../images/NLB Fake News Busters Characters_Emma.png"
import raju from "../images/NLB Fake News Busters Characters_Raju.png"
import sarah from "../images/NLB Fake News Busters Characters_Sarah.png"
import upin from "../images/NLB Fake News Busters Characters_Upin.png"

class App extends Component {
  render() {
    const settings = {
      dots: true,
      autoplay: true,
      infinite: true,
      slidesToShow: 3,
      slidesToScroll: 1,
      autoplaySpeed: 3000,
      responsive: [
        {
          breakpoint: 1200,
          settings: {
            slidesToShow: 2,
            slidesToScroll: 1,
            initialSlide: 1,
          },
        },
        {
          breakpoint: 800,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1,
            initialSlide: 1,
          },
        },
      ],
    };

    var isElementInViewPort = function isElementInViewPort(el) {
      var scroll = window.scrollY || window.pageYOffset;
      var boundsTop = el.getBoundingClientRect().top + scroll;
      var viewport = {
        top: scroll,
        bottom: scroll + window.innerHeight,
      };
      var bounds = {
        top: boundsTop,
        bottom: boundsTop + el.clientHeight,
      };

      return (
        (bounds.bottom >= viewport.top && bounds.bottom <= viewport.bottom) ||
        (bounds.top <= viewport.bottom && bounds.top >= viewport.top)
      );
    };

    document.addEventListener("DOMContentLoaded", function () {
      var animatedElements = document.querySelectorAll(
        "[data-animation-onscroll]"
      );
      var activatedElemClass = "activated";
      var onActivatedAnimation = function onActivatedAnimation(items) {
        var _loop = function _loop(i) {
          if (
            isElementInViewPort(items[i]) &&
            !items[i].classList.contains(activatedElemClass)
          ) {
            var delay = items[i].dataset.animationOnscrollDelay;
            var type = items[i].dataset.animationOnscroll;
            items[i].classList.add(activatedElemClass);

            setTimeout(function () {
              if (type === "fade") {
                fadeAnimation(items[i]);
              } else if (type === "text") {
                animationText(items[i]);
              }
            }, delay);
          }
        };

        for (var i = 0; i < items.length; i++) {
          _loop(i);
        }
      };

      var animationText = function animationText(elem) {
        var textArray = elem.textContent.split(" ");
        elem.innerHTML = "";
        elem.style.opacity = 1;

        var _loop2 = function _loop2(i) {
          setTimeout(function () {
            var item = document.createElement("span");
            var text = document.createTextNode(textArray[i] + " ");
            item.appendChild(text);
            item.style.opacity = 0;
            elem.appendChild(item);
            animate(function (timePassed) {
              item.style.opacity = timePassed / 200;
            }, 200);
          }, i * 150);
        };

        for (var i = 0; i < textArray.length; i++) {
          _loop2(i);
        }
      };

      var fadeAnimation = function fadeAnimation(elem) {
        var duration = 600;
        var translatePixels = 20;
        animate(function (timePassed) {
          var translateYValue =
            translatePixels - translatePixels * (timePassed / duration);
          elem.style.opacity = timePassed / duration;
          elem.style.transform = "translate(0," + translateYValue + "px)";
        }, duration);
      };

      function animate(draw, duration) {
        var start = performance.now();
        requestAnimationFrame(function animate(time) {
          var timePassed = time - start;
          if (timePassed > duration) {
            timePassed = duration;
          }
          draw(timePassed);
          if (timePassed < duration) {
            requestAnimationFrame(animate);
          }
        });
      }

      onActivatedAnimation(animatedElements);
      window.addEventListener("scroll", function () {
        onActivatedAnimation(animatedElements);
      });
    });

    return (
      <div className="character-container">
        <p
          className="section-header anim-onscroll"
          style={{ flex: 1 }}
          data-animation-onscroll="fade"
          data-animation-onscroll-delay="700"
        >
          Our Detectives
        </p>
        <div className="slick-container">
          <Slider {...settings}>
            <div className="flip-card">
              <div className="flip-card-inner">
                <div className="flip-card-front">
                  <img className="slider-img" src={sarah} alt="Sarah" />
                </div>
                <div className="flip-card-back">
                  <div className="card-info">
                    <h5>Sarah</h5>
                    <p>
                      Hi! I’m Source-Finding Sarah. I have my tablet computer,
                      books and maps to help me examine various sources first
                      before believing them. I always check out where my
                      information comes from before trusting what they say!
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="flip-card">
              <div className="flip-card-inner">
                <div className="flip-card-front">
                  <img className="slider-img" src={upin} alt="Upin" />
                </div>
                <div className="flip-card-back">
                  <div className="card-info">
                    <h5>Upin</h5>
                    <p>
                      I’m Understanding Upin! I always make sure that I know
                      what I’m reading and spend time thinking about whether the
                      information is backed up by evidence (or proof). I often
                      think to myself while reading, “Is this a fact or
                      someone’s point-of-view?”. Sometimes I also wonder about
                      the reasons why someone writes about something.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="flip-card">
              <div className="flip-card-inner">
                <div className="flip-card-front">
                  <img className="slider-img" src={raju} alt="Raju" />
                </div>
                <div className="flip-card-back">
                  <div className="card-info">
                    <h5>Raju</h5>
                    <p>
                      Hello! I’m Researching Raju. When I do my research, I dig
                      deeper and search for different credible sources to
                      cross-check that my information is correct, just like a
                      detective! My motto is, “Always cross check your
                      information!”.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="flip-card">
              <div className="flip-card-inner">
                <div className="flip-card-front">
                  <img className="slider-img" src={emma} alt="Emma" />
                </div>
                <div className="flip-card-back">
                  <div className="card-info">
                    <h5>Emma</h5>
                    <p>
                      I’m Evaluating Emma! This is my favourite t-shirt because
                      it has the “scale of justice” and reminds me to weigh all
                      the different sides to a news story. With my handy
                      checklist and clipboard, I make sure to look at all angles
                      before coming to my own opinion!
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Slider>
        </div>
      </div>
    );
  }
}

export default App;
