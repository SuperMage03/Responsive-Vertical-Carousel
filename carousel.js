class Carousel {
    constructor(node) {
        this.carouselNode = node;

        this.frameNode = this.carouselNode.querySelector(".carousel-frame");
        this.prevBtn = this.carouselNode.querySelector(".carousel-prevBtn");
        this.nextBtn = this.carouselNode.querySelector(".carousel-nextBtn");

        this.selectedIdx = 0;
        this.slides = [];
        this.referenceSlideNodes = [];


        Array.from(this.frameNode.querySelectorAll("img")).forEach((slideNode, index) => {
            this.slides.push(new CarouselSlides(slideNode, index));
            this.referenceSlideNodes.push(slideNode.cloneNode());
        });

        this.prevBtn.addEventListener("click", () => { this.prevBtnListener(); });
        this.nextBtn.addEventListener("click", () => { this.nextBtnListener(); });
        this.update();
    }

    // get frameWidth() {
    //     return this.frameNode.getBoundingClientRect().width;
    // }

    get frameHeight() {
        return this.frameNode.getBoundingClientRect().height;
    }

    prevBtnListener() {
        this.selectedIdx = remainder((this.selectedIdx + 1), this.slides.length);
        this.update();
    }


    nextBtnListener() {
        this.selectedIdx = remainder((this.selectedIdx - 1), this.slides.length);
        this.update();
    }

    update() {
        // Centering Selected Slide
        const selectedSlide = this.slides[this.selectedIdx];
        selectedSlide.node.style.top = `${Math.ceil(this.frameHeight / 2)}px`;

        const slideDownOffset =  this.slides[remainder(this.selectedIdx+1, this.slides.length)].slideHeight / 2 - selectedSlide.slideHeight / 2;
        const slideUpOffset =  this.slides[remainder(this.selectedIdx-1, this.slides.length)].slideHeight / 2 - selectedSlide.slideHeight / 2;

        // Placing slides down;
        let slideDownPosition = this.frameHeight / 2;
        let slideDownIdx = this.selectedIdx + 1;



        // Line up all of the existing slides below the selected slide
        while (slideDownIdx < this.slides.length) {
            slideDownPosition += this.slides[slideDownIdx].slideHeight / 2 + this.slides[slideDownIdx-1].slideHeight / 2;
            this.slides[slideDownIdx].node.style.top = `${Math.ceil(slideDownPosition)}px`;

            slideDownIdx++;

            // If there is enough slide to form a loop then stop
            if (slideDownPosition - slideDownOffset - this.slides[slideDownIdx-1].slideHeight / 2 >= this.frameHeight) {
                break;
            }
        }

        // If there isn't enough slide below selected slide to have a loop
        if (slideDownPosition - slideDownOffset - this.slides[slideDownIdx-1].slideHeight / 2 < this.frameHeight) {
            while (slideDownPosition - slideDownOffset - this.slides.slice(-1)[0].slideHeight / 2 < this.frameHeight) {
                const lastSlide = this.slides.slice(-1)[0];
                const lastSlideID = lastSlide.slideID;

                const newNode = this.referenceSlideNodes[remainder(lastSlideID+1, this.referenceSlideNodes.length)].cloneNode();
                lastSlide.node.after(newNode);
                this.slides.push(new CarouselSlides(newNode, remainder(lastSlideID+1, this.referenceSlideNodes.length)));

                slideDownPosition += this.slides.slice(-1)[0].slideHeight / 2 + this.slides.slice(-2)[0].slideHeight / 2;
                this.slides.slice(-1)[0].node.style.top = `${Math.ceil(slideDownPosition)}px`;
            }
        }



        // If there is enough slide and there are excess slide then delete them
        else if (slideDownIdx < this.slides.length) {
            for (let i = this.slides.length-1; i >= slideDownIdx; i--) {
                this.slides.slice(-1)[0].node.remove();
                this.slides.pop();
            }
        }


        // Placing slides up;
        let slideUpPosition = this.frameHeight / 2;
        let slideUpIdx = this.selectedIdx - 1;

        // Line up all of the existing slides above the selected slide
        while (slideUpIdx >= 0) {
            slideUpPosition -= this.slides[slideUpIdx].slideHeight / 2 + this.slides[slideUpIdx+1].slideHeight / 2;
            this.slides[slideUpIdx].node.style.top = `${Math.ceil(slideUpPosition)}px`;

            slideUpIdx--;

            // If there is enough slide to form a loop then stop
            if (slideUpPosition + slideUpOffset + this.slides[slideUpIdx+1].slideHeight / 2 <= 0) {
                break;
            }
        }

        // If there isn't enough slide below selected slide to have a loop
        if (slideUpPosition + slideUpOffset + this.slides[slideUpIdx+1].slideHeight / 2 > 0) {
            while (slideUpPosition + slideUpOffset + this.slides[0].slideHeight / 2 > 0) {
                const firstSlide = this.slides[0];
                const firstSlideID = firstSlide.slideID;

                const newNode = this.referenceSlideNodes[remainder(firstSlideID-1, this.referenceSlideNodes.length)].cloneNode();
                firstSlide.node.before(newNode);
                this.slides.unshift(new CarouselSlides(newNode, remainder(firstSlideID-1, this.referenceSlideNodes.length)));

                slideUpPosition -= this.slides[0].slideHeight / 2 + this.slides[1].slideHeight / 2;
                this.slides[0].node.style.top = `${Math.ceil(slideUpPosition)}px`;
                this.selectedIdx++;
            }
        }

        // If there is enough slide and there are excess slide then delete them
        else if (slideUpIdx + 1 > 0) {
            for (let i = 0; i < slideUpIdx + 1; i++) {
                this.slides[0].node.remove();
                this.slides.shift();
                this.selectedIdx--;
            }
        }
    }
}

function remainder(num, divisor) {
    return (num % divisor + divisor) % divisor;
}

class CarouselSlides {
    constructor(node, slideID) {
        this.node = node;
        this.slideID = slideID;
    }

    // get slideWidth() {
    //     return this.node.getBoundingClientRect().width;
    // }

    get slideHeight() {
        return this.node.getBoundingClientRect().height;
    }
}



const carousels = [];

window.onload = () => {
    const carouselNodes = Array.from(document.querySelectorAll(".carousel"));

    carouselNodes.forEach(carouselNode => {
        carousels.push(new Carousel(carouselNode));
    })
};


window.addEventListener("resize", () => {
    carousels.forEach(carousel => carousel.update());
});