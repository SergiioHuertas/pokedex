<script>
    export let open = false
</script>

<div class="button-wrapper">
    <button class="text-gray-500 hover:text-gray-700 cursor-pointer mr-4 border-none focus:outline-none" class:open on:click={() => open = !open}>
        <svg width=32 height=24>
            <line id="top" x1=8 y1=7  x2=24 y2=7 />
                <line id="middle" x1=8 y1=12 x2=24 y2=12 />
                    <line id="bottom" x1=8 y1=17 x2=24 y2=17 />
        </svg>
    </button>
</div>

<style>
    svg {
        min-height: 24px;
        transition: transform 0.3s ease-in-out;
    }

    svg line {
        stroke: currentColor;
        stroke-width: 3;
        transition: transform 0.3s ease-in-out
    }

    button {
        z-index: 1010;
        position: fixed;
        background-color: white;
        border: 1px solid #e2e8f0;
        border-radius: 50%;
        left: 2%;
        top: 2%;
        align-items: center;
        justify-content: center;
    }

    .open svg {
        transform: scale(0.7)
    }

    .open #top {
        transform: translate(8px, 0px) rotate(45deg)
    }

    .open #middle {
        opacity: 0;
    }

    .open #bottom {
        transform: translate(-10px, 15px) rotate(-45deg)
    }
</style>